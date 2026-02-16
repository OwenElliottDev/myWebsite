import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/multiprocessing-context/hero.webp';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>A Multiprocessing Context for Python</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:description" content="A context API for multiprocessing" />
        <meta property="og:title" content="A Multiprocessing Context for Python" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="multiprocessing, python, introspections" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>
          {`# Creating a Multiprocessing Context in Python


We've all been there, you are whipping up some code that loops through a list of image URLs or files on disk and loads them into memory. You get the code up and running only to find your loop is slow because each iteration is very IO bound, either by network or disk. Time is money and you need to refactor it to run in parallel. Making this refactoring process easy is what I set out to solve with my \`workercontext\` library!

I run into this all the time at Marqo, when preparing data for fine-tuning we often need to download tens of millions of images or apply transformations to them and write them to disk or cloud storage. This is what I created \`workercontext\` to solve.

If you don't like reading the instructions then you can get started straight away:

\`\`\`plaintext
pip install workercontext
\`\`\`

I figured this library also created a good opportunity to talk about introspection in Python and how it can be used in creative ways.

See it in action:
![Demo GIF of the library](https://d3kjqeh110p10g.cloudfront.net/2023-07-13-multiprocessing-context/multiprocess_demo.gif)

This library uses the dynamic nature of Python to introspect your code at run time and automatically make a multiprocessing version of your code. This makes refactoring simple, see the below example.

We start with a function:

\`\`\`python
import os
from PIL import Image

def resize_images(image_file_paths: List[str], out_dir: str, image_size: Tuple[int, int]) -> Image:
    '''
    An IO heavy function that reads images from a list of
    file paths, resizes them, and writes them to a new folder
    '''
    for image_path in image_file_paths:
        im = Image.open(image_path)
        im = im.resize(image_size)
        im.save(os.path.join(out_dir, os.path.basename(image_path)))
\`\`\`

Our main might look like this:

\`\`\`python
if __name__ == "__main__":
    images_paths = [os.path.join("images", f) for f in os.listdir("images")]
    image_size = (224, 224)
    resize_images(images_paths, "processed", image_size)
\`\`\`

And with \`workercontext\` we can refactor it like so:

\`\`\`python
from workercontext import MultiWorker

if __name__ == "__main__":
    images_paths = [os.path.join("images", f) for f in os.listdir("images")]
    image_size = (224, 224)
    with MultiWorker(resize_images, n_processes=16) as parallel_resize_images:
        parallel_resize_images(images_paths, "processed", image_size)
\`\`\`

Three interesting things to note:
+ We don't need to tell it which argument to use for batching
+ The results will come out in the same order as the original one
+ Our program requires \`if __name__ == "__main__":\`

## Performance

To get a quick comparison I ran the two version above on 40,080 images. The original single process version manages to complete the process in 14 minutes and 50 seconds. The multiprocessing version on the other hand completes in just 2 minutes and 20 seconds!

Now lets look at the code to understand how it works.

## The Code

### What is a 'Context' in Python?

In Python, contexts are denoted with the \`with\` keyword. A context is effectively a scope where some value exists, the special part is that it gets to execute code at entry and exit of its context. This is defined in the dunder methods \`__enter__\` and \`__exit__\`.

Contexts are often used for things like reading files. To read a file you need to open it, get the data and then close it. Forgetting to close it can cause problems so a nice way to never forget is to use a context like so:

\`\`\`python
with open("my_file.txt", 'r') as f:
    contents = f.read()
\`\`\`

Python will call an \`__enter__\` method that opens the file when you enter the context, upon leaving the context the \`__exit__\` method will be called which closes the file.

In \`workercontext\`, the \`__enter__\` and \`__exit__\` methods are used to create and close a multiprocessing pool. Within the context a new version of your function is created which automatically divides up the work amongst the \`n_processes\` workers for them to complete. This is done using introspection.

### Introspection

Introspection is the process of analysing code at run time to get information about objects and their types, this can be used to govern the behaviour of a program. Python is a dynamic language with duck typing - these two properties make it great for very flexible introspection of code at run time.

Python comes with a module called \`inspect\` which is designed for code introspection, it lets you do things like get the arguments for a funciton or see its source code at run time.

The \`MultiWorker\` class is instantiated with the following instance variables:

\`\`\`python
class MultiWorker:
    def __init__(
        self,
        function: Callable,
        n_processes: int,
        batched_arg: str = None,
        verbose: bool = False,
        reduction: Callable[[List[Any]], Any] = None,
    ):
        self.function = function
        self.batched_arg = batched_arg
        self.n_processes = n_processes
        self._verbose = verbose
        self._reduction = reduction
        self.pool = multiprocessing.Pool(self.n_processes)
\`\`\`

Where \`self.function\` is the function you want to parallelise.

The \`_batched_function\` function in \`MultiWorker\` converts any function into a version that can be executed in multiple batches, its signature is as follows.

\`\`\`python
def _batched_function(self, *args, **kwargs) -> List[Any]:
\`\`\`

To create a multiprocessing version of a function we need to work out which argument should be used for parallelisation. The user can provide one or more argument names via \`batched_args\` however if this is not provided then the introspection lets us determine it automatically.

\`\`\`python
# Introspect the args to the function
argspec = inspect.getfullargspec(self.function)
func_args = argspec.args
\`\`\`

\`func_args\` will contain the names of the arguments to the provided function. To ensure that the process can be applied to methods of classes a check is made to remove the first argument if it is \`self\`.

\`\`\`python
# if the first arg is self then drop it because it is provided by its class
if func_args[0] == "self":
    func_args = func_args[1:]
\`\`\`

If no \`batched_args\` were provided then the first argument to the function is used.

We need a way to pass our arguments into batches to subprocesses. In python positional arguments can be replaced with equivelant keyword arguments, we convert all the arguments that were introspected into keyword arguments.

\`\`\`python
# convert all args to kwargs using introspected args
for i, arg in enumerate(args):
    kwargs[func_args[i]] = arg
\`\`\`

The batched argument is introspected to check it is indeed a list and can be used for the batching.

\`\`\`python
if not isinstance(kwargs[self.batched_arg], list):
    raise ValueError("Batched args must be an instance of list")
\`\`\`

The chunk size for each worker is calculated.

\`\`\`python
# get size of batched arg
arg_size = len(kwargs[self.batched_arg])
# calculate chunksize
chunk_size = arg_size // self.n_processes
\`\`\`

The \`kwargs\` are then expanded into a list of \`kwargs\` that differ by the batched argument only.

\`\`\`python
# convert the batched arg into batches
kwargs[self.batched_arg] = self.batchify(
    kwargs[self.batched_arg], chunk_size=chunk_size
)

# create a list of kwargs with each batched_arg arg having a single batch
batched_args = []
for batch in kwargs[self.batched_arg]:
    new_args = dict(kwargs)
    new_args[self.batched_arg] = batch
    batched_args.append(new_args)
\`\`\`

At this point, the heavy lifting and introspecting has been done, we just need to create a number of partial functions and map these to a processing pool as follows.

\`\`\`python
# create a pool - the function is wrapped up in a worker so we can pool on all args
func_outputs = self.pool.map(
    partial(_worker, function=self.function), batched_args
)
\`\`\`

This uses a littler helper function that nicely wraps the \`kwargs\` into a single parameter for the partial function.

\`\`\`python
def _worker(kwargs, function: Callable) -> Any:
    """Helper to wrap a function for multiprocessing"""
    return function(**kwargs)
\`\`\`

### Enter and exit

The process above is all triggered in the \`__enter__\` and \`__exit__\` methods.

\`\`\`python
def __enter__(self) -> Callable:
    """Creates a temporary multiprocessing context for a function

    Returns:
        Callable: Return a batched version of the function with multiprocessing
    """
    return self._batched_function

def __exit__(self, exc_type, exc_val, exc_tb) -> None:
    """Close the pool when done"""
    self.pool.close()
    self.pool.join()
\`\`\`

The \`__enter__\` method returns the batched version of the function which allows us to use it within the context it creates.


## Reductions

The \`workercontext\` library also contains a number of 'reductions' to apply to the output. These allow you to consolidate the output from various workers in a multitude of ways. The included reductions are:
- \`flatten_reduction\`
- \`sum_reduction\`
- \`average_reduction\`
- \`histogram_reduction\`
- \`product_reduction\`
- \`string_concatenation_reduction\`
- \`bitwise_and_reduction\`
- \`bitwise_or_reduction\`
- \`min_reduction\`
- \`max_reduction\`

You can also compose and chain these reductions via the provided \`ReductionComposition\` class.

### Examples

Reductions have a variety of use cases.

The most common one would be to reconcile the output of a function that returns a list, we need to flatten the list to make it appear that same as it would for a non-multiprocessing version of the function.

\`\`\`python
def my_list_function(l: List[int]) -> List[int]:
    return [i for i in l]

with MultiWorker(my_list_function, n_processes=16, reduction=flatten_reduction) as parallel_my_list_function:
    result = parallel_my_list_function([1, 2, 3]*100)
\`\`\`

Other reductions also have important use cases, for example \`sum_reduction\` can be applied to a function that would typically sum all of its outputs.

\`\`\`python
def my_summing_function(l: List[int]) -> int:
    l = [i**0.5 for i in l]
    return sum(l)

with MultiWorker(my_summing_function, n_processes=16, reduction=sum_reduction) as parallel_my_summing_function:
    result = parallel_my_summing_function([4, 5, 6]*100)
\`\`\`

## Conclusion

Introspection is a powerful tool which has many real world use cases. In a language like Python it is easy to exploit these techniques in interesting ways to make highly flexible and reusable pieces of code. If you want to use \`workercontext\` yourself then feel free to fork [the repo](https://github.com/OwenPendrighElliott/MultiWorker) or install it via \`pip\`. The code is under an MIT licence.

\`\`\`plaintext
pip install workercontext
\`\`\``}
        </ArticleBlock>
      </div>
    </div>
  );
};

export default Contemplation;
