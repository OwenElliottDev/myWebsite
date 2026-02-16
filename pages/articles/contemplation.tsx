import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/contemplation/hero.webp';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>Contemplation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:description" content="Introspection utilities in Python" />
        <meta property="og:title" content="Contemplation" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="contemplation, coding, introspection, python" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>
          {`
# Contemplation of Objects at Run-Time

Introspection lets us peer into the workings of a program at run-time. It is a powerful tool that can be used to examine the structure of a program, to modify the behavior of a program, and to alter the flow of control in a program. I've gone down a rabbit hole of introspection for the past few weeks, and it's resulted in a new library called [Contemplation](https://github.com/OwenPendrighElliott/contemplation).

In this article I will go through \`contemplation\`, what is it, how it works, and why I made it.

## Some Background

I got back from my morning coffee to a message from a colleague, roughly paraphrased as follows:

> Hey Owen. We're adding a new error message. The message is something like this
>
>"This method is deprecated and will be removed in Marqo 2.0.0, instead use 'client.index(index_name).get_cuda_info()"
>
>The problem is, \`client\` isn't quite right because a user could be calling the Client instance anything. Same would apply to \`mq.index(...).get_cuda_info()\` (just because we call it \`mq\` in the docs). Another option is \`Index.get_cuda_info()\` which is correct but will confuse people (how do I get an instance of Index?).

I thought to myself, "Wouldn't it be neat if you could have the error message know what the user had named the object?". I surmised that Python likely had a way to introspect this information, so I assembled the following code:

\`\`\`python
import inspect

def get_name_in_caller_scope(me: object) -> str:
    frame = (
        inspect.currentframe().f_back.f_back
    )  # Two steps back to get to the caller's scope
    local_vars = frame.f_locals
    names = [name for name, var in local_vars.items() if var is me]
    if names:
        return names[0]

    raise ValueError("Object not found in caller's local scope")
\`\`\`

Now when you write a function with an error message like the following:

\`\`\`python
def add_one(a: int) -> int:
    if not isinstance(a, int):
        raise TypeError(f"Your variable called '{get_name_in_caller_scope(a)}' must be an int")
    return a + 1

my_variable_that_i_named = "string"
add_one(my_variable_that_i_named)
\`\`\`

You can print errors like this:

\`\`\`plaintext
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in add_one
TypeError: Your variable called 'my_variable_that_i_named' must be an int
\`\`\`

This is a pretty neat trick, and it works because Python uses reference counting to manage memory. When you assign a variable to an object, the variable is just a reference to the object in memory. So when you pass the object to a function, the function can look up the variable name in the caller's scope and find out what it was called. This is not something that is typically done in Python, but it is possible.

This functionality enables the function to recognize the variable name used in the caller's scope.

While this didn't end up being the solution to our particular problem it did get me thinking about what other questions one could ask of a program at run time. This quickly turned into a library with a number of associated tools.

## Contemplation: What does it do?

For this library, I broke the introspections into three (somewhat arbitrary) categories:
+ Instance Introspections
+ Execution Introspections
+ Type Introspections

At a high level, instance introspectios are introspections that look at instances of objects, execution introspections are introspections that look at the execution of a program, and type introspections are introspections that look at the types of objects.

### Execution Introspections

I start with these only as they are probably the most useful of the lot.

The following execution introspections are provided:
+ \`CallCounter\` - counts the number of times functions registered to it are called.
+ \`ExecutionTimer\` - times the execution of functions registered to it.
+ \`FunctionLogger\` - logs the times, arguments, and return values of functions registered to it.

With these utilities you can track the execution of your program for debugging purposes with much greater ease.

#### ExecutionTimer

I, and many other devs, are tired of writing boilerplate code like the following to time a function:

\`\`\`python
import time

def func():
    # do something
    pass

start = time.time()

func()

end = time.time()

print(f"Execution took {end - start} seconds")
\`\`\`

With \`ExecutionTimer\` you can replace this with:

\`\`\`python
from contemplation import ExecutionTimer

et = ExecutionTimer()

@et.time_execution
def func():
    # do something
    pass

func()

et.pretty_print_times()
\`\`\`

You can decorate multiple functions with the same timer instance, the times can be exracted individually, or you can print them all at once.

\`\`\`python
et = ExecutionTimer()

@et.time_execution
def func():
    # do something
    pass

@et.time_execution
def another_func():
    # do something
    pass

func()
another_func()

# print all times
et.pretty_print_times()

# print time by function instance
print(et.get_execution_time(func))

# get by string name of function
print(et.get_execution_time("func"))
\`\`\`

An example of the pretty printing is as follows:

\`\`\`python
from contemplation import ExecutionTimer

et = ExecutionTimer()

@et.time_execution
def func():
    for i in range(1000000):
        i**0.5

for _ in range(10):
    func()

et.pretty_print_times()
\`\`\`

\`\`\`plaintext
Function | Total Time (s) | Average Time (s)
--------------------------------------------
func     | 0.467095       | 0.046709
\`\`\`

The same API is provided for the \`CallCounter\` and \`FunctionLogger\` classes.

#### Call Counter

The \`CallCounter\` class is used to count the number of times a function is called. It can be used as follows:

\`\`\`python
from contemplation import CallCounter

cc = CallCounter()

@cc.count_calls
def func():
    # do something
    pass

for _ in range(100):
    func()

cc.pretty_print_counts()
\`\`\`

\`\`\`plaintext
Function | Count
----------------
func     | 100
\`\`\`

#### Function Logger

The \`FunctionLogger\` class is used to log calls to functions. By default it will log not log the arguments and returns however these can be toggled in the decorator.

\`\`\`python
from contemplation import FunctionLogger

fl = FunctionLogger()

@fl.log_function(log_args=True, log_returns=True)
def func(a: int, b: int) -> int:
    return a+b

func(1, 4)

fl.pretty_print_logs()

for log in fl:
    print(log)
\`\`\`

\`\`\`plaintext
Function | Start Time (s)    | Duration (s)
-------------------------------------------
func     | 1693611112.889713 | 0.000003

FunctionEvent(name=func, start_time=1693611112.8897128, end_time=1693611112.889716, duration=3.0994415283203125e-06, function_arguments={'a': 1, 'b': 4}, function_returns=5)
\`\`\`

You can also write the logs to a JSON lines file.

\`\`\`python
fl.write_jsonl("logs.jsonl")
\`\`\`

\`logs.jsonl\`:

\`\`\`json
{"name": "func", "start_time": 1693611112.8897128, "end_time": 1693611112.889716, "duration": 3.0994415283203125e-06, "function_arguments": {"a": 1, "b": 4}, "function_returns": 5}
\`\`\`

### Instance Introspections

The following are implemented as functions in \`contemplation\`:

+ \`how_many_of_my_type_exist\` - how many instances of a type exist given an instance.
+ \`how_many_of_type_exist\` - how many instances of a type exist given a type.
+ \`get_name_in_caller_scope\` - get the name an instance was assigned to in the scope of the caller.
+ \`get_name_in_all_scope\` - get the name an instance was assigned to in the scope of the caller and all parent scopes.

These introspection tools are the original ideas that inspired me to create this package.

#### Variable Names and Scopes

\`get_name_in_caller_scope\` is as per my original example. \`get_name_in_all_scope\` extends this concept to all caller scopes allowing you to trace a variable when debugging.

\`\`\`python
from contemplation import get_name_in_all_scope

def sum_squares(num1: int, num2: int) -> int:
    return square(num1) + square(num2)

def square(my_num: int) -> int:
    print(get_name_in_all_scope(my_num))
    return my_num**2


the_first_num = 1
the_second_num = 2
sum_squares(the_first_num, the_second_num)
\`\`\`

Will print the following, allowing us to see all names in parents scopes for the two variables, scope ascending left to right:

\`\`\`plaintext
['my_num', 'num1', 'the_first_num']
['my_num', 'num2', 'the_second_num']
\`\`\`

This function works much the same way as \`get_name_in_caller_scope\` however it uses a loop to keep stepping backwards through stack frames until it reaches the top.

\`\`\`python
def get_name_in_all_scope(me: object) -> List[str]:
    names = []
    frame = inspect.currentframe().f_back  # Start with the caller's frame

    while frame:
        local_vars = frame.f_locals
        names += [name for name, var in local_vars.items() if var is me]
        frame = frame.f_back  # Move to the previous frame

    return names
\`\`\`

#### Counting Instances

How many objects of a given type exist?

\`\`\`python
from contemplation import how_many_of_type_exist

class MyClass():
    def __init__(self):
        pass

a = MyClass()

b = MyClass()

def func():
    c = MyClass()
    print(how_many_of_type_exist(MyClass))

func()

print(how_many_of_type_exist(MyClass))
\`\`\`

Will print:

\`\`\`plaintext
3
2
\`\`\`

This is because \`a\` and \`b\` are instances of \`MyClass\` and \`c\` is an instance of \`MyClass\` that is in the scope of \`func\`. Once the scope of \`func\` is exited, \`c\` is garbage collected and the count is reduced to 2.

So how do we count the instances? We ask the garbage collector!

\`\`\`python
def how_many_of_type_exist(cls: type) -> int:
    return sum(isinstance(obj, cls) for obj in gc.get_objects())
\`\`\`

This little one liner does it all, we simply iterate over everything that the garbage collector (\`gc\`) knows about and count it if it is of the correct type.

### Type Introspections

The type introspections are very much in their infancy at the moment and as such I decided to put them in an expermental section of the API for the moment as there are definitely edge cases which are not covered.

The type introspections introduce things like type checking at run time and evaluation of fully annotated typed from objects.

#### Type Checking

\`\`\`python
from typing import Dict, List
from contemplation.experimental import type_enforced

@type_enforced(deep=True)
def test_func(d: Dict[str, List[int]]) -> int:
    s = 0
    for k in d:
        s += sum(d[k])
    return s

# this works no problems
d = {"a": [1, 2, 3], "b": [4, 5, 6]}
print(test_func(d))

# this fails
d = {"a": [1, 2, 3], "b": [4, 5, "6"]}
print(test_func(d))
\`\`\`

The \`type_enforced\` decorator will check the types of the arguments and return value of the function. If the types are not correct then a \`TypeError\` will be raised.

This is done by looking at the annotations that you provide the function. Lets go through it in detail:


The actual decorator is returned by the outer function which is required to parameterize the decorator. This is because we need to know whether to do a deep or shallow type check. A deep type check will check all nestings of the annotation, a shallow type check will only check the top level annotation.

First we set the appropriate type checking function, either \`_deep_is_of_type\` or \`_shallow_is_of_type\`. We then use the \`inspect\` library to get the signature, parameters, and return annotation of the function. If the return annotation is not provided then we set it to \`None\`.

\`\`\`python
def type_enforced(deep: bool = True):
    def decorator(func: Callable) -> Callable:
        type_checker = _deep_is_of_type if deep else _shallow_is_of_type
        signature = inspect.signature(func)
        parameters = signature.parameters
        return_annotation = signature.return_annotation
        return_type = (
            return_annotation if return_annotation is not inspect._empty else None
        )
        ...
\`\`\`

We can then use a wrapper in the decorator to house our type checking logic either side of the function.

We go through the parameters and their annotations, passing them to the type checker that was selected, a failed type check will raise a \`TypeError\`.

The deep type checker will recursively check the types of nested annotations. The \`typing\` module includes a \`get_origin\` method which will return the origin of a type, for example \`List[int]\` will return \`list\` as well as a \`get_args\` method which will return the arguments of a type, for example \`List[int]\` will return \`[int]\`. We can use these methods to check the types of nested annotations.

\`\`\`python
if isinstance(parameter_type, type(Union)):
    return any(_deep_is_of_type(parameter, t) for t in get_args(parameter_type))

origin = get_origin(parameter_type)
if origin is None:
    return isinstance(parameter, parameter_type)
\`\`\`

A series of rather inelegant if else statements attempt to catch most major cases, for example if origin is a \`dict\`:

\`\`\`python
if origin is dict:
    key_type, value_type = args
    return all(
        _deep_is_of_type(k, key_type) and _deep_is_of_type(v, value_type)
        for k, v in parameter.items()
    )
\`\`\`

or if it is a \`Generator\`:

\`\`\`python
elif origin is Generator:
    if not hasattr(parameter, "next") and not hasattr(parameter, "__next__"):
        return False
    return True
\`\`\`

or if it is a \`Callable\`:

\`\`\`python
elif origin is Callable:
    if not hasattr(parameter, "__call__"):
        return False
    return True
\`\`\`

etc...

Along with all default python types the following origins are covered:
+ \`list\`
+ \`tuple\`
+ \`set\`
+ \`frozenset\`
+ \`dict\`
+ \`Generator\`
+ \`Iterable\`
+ \`Callable\`
+ \`Union\`


#### Deriving a Type

The other interesting utility in this part of the API is the \`introspect_type\` function.

This takes an object of Any type and returns a proper type annotation for it. For example:

\`\`\`python
from contemplation.experimental import introspect_type

my_dict = {"a": [1, 2, 3], "b": [4, 5, 6]}

print(introspect_type(my_dict))
\`\`\`

Will print:

\`\`\`plaintext
typing.Dict[str, typing.List[int]]
\`\`\`

Similar to the others this is largely a series of if else statements. This interesting part is making a \`Union\` dynamically.

Turns out you aren't really meant to do this in Python, infact VSCode is perpetually red in this project but it does indeed run.

\`\`\`python
def _make_union(types: List[type]):
    # VSCode hates this but the Union class actually has code
    # specifically to handle a tuple of types
    return Union[tuple(types)]
\`\`\`

Turns out that union actually uses a tuple under the hood. In \`3.11/lib/python3.11/typing.py\` we can see the following in the constructor for \`Union\`:

\`\`\`python
if not isinstance(parameters, tuple):
    parameters = (parameters,)
\`\`\`

\`Union\` actually converts the types to a tuple anyway so we can give it one directly an all will work, despite not being a typical or documented pattern.

## Summing Up

This was a pretty code heavy article but hopefully it has piqued your interest in introspection.

I hope this package can prove useful or are the very least be an interesting exercise in introspection with Python. If you would like to suggestion some other capabilities or an implementation for something that fits into this library then please let me know on [GitHub](https://github.com/OwenPendrighElliott/contemplation).`}
        </ArticleBlock>
      </div>
    </div>
  );
};

export default Contemplation;
