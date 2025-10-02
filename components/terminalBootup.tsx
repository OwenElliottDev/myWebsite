import { setUsername } from '@/store/commandlineSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

const loginMessage = (ip: string, username: string) => {
  const currentWindowWidth: number = window.innerWidth;
  const currentdate = new Date();
  const datetime =
    ('0' + currentdate.getDate()).slice(-2) +
    '/' +
    ('0' + (currentdate.getMonth() + 1)).slice(-2) +
    '/' +
    currentdate.getFullYear() +
    '@' +
    ('0' + currentdate.getHours()).slice(-2) +
    ':' +
    ('0' + currentdate.getMinutes()).slice(-2);

  if (currentWindowWidth > 768) {
    return (
      <>
        <p className="typed typed1">{`logged in as: ${username ? username : 'guest'}`}</p>
        <p className="typed typed2">{`###################################################################################################`}</p>
        <p className="typed typed3">{`#                                    Welcome to My Website!                                       #`}</p>
        <p className="typed typed4">{`#                              Owen's Server release 0.3.1 (beta)                                 #`}</p>
        <p className="typed typed5">{`#                                                                                                 #`}</p>
        <p className="typed typed6">{`# You are on the latest release                                                                   #`}</p>
        <p className="typed typed7">{`# Run 'help' for tips on getting started                                                          #`}</p>
        <p className="typed typed8">{`# For any bugs or issues with the release please reach out on GitHub                              #`}</p>
        <p className="typed typed9">{`# Current login: ${datetime} from ${ip} ${' '.repeat(
          18 - ip.length,
        )}                                        #`}</p>
        <p className="typed typed10">{`###################################################################################################`}</p>
      </>
    );
  }
  return (
    <>
      <p className="typed typed1">{`logged in as: ${username ? username : 'guest'}`}</p>
      <p className="typed typed2">{`#######################################################`}</p>
      <p className="typed typed3">{`#               Welcome to My Website!                #`}</p>
      <p className="typed typed4">{`#         Owen's Server release 0.3.1 (beta)          #`}</p>
      <p className="typed typed5">{`#                                                     #`}</p>
      <p className="typed typed6">{`# You are on the latest release                       #`}</p>
      <p className="typed typed7">{`# Run 'help' for tips on getting started              #`}</p>
      <p className="typed typed8">{`# Current login: ${datetime} from ${ip} ${' '.repeat(
        14 - ip.length,
      )}#`}</p>
      <p className="typed typed9">{`#######################################################`}</p>
    </>
  );
};

const LoginMessage = () => {
  let username = localStorage.getItem('username');
  username = username ? username : 'guest';
  const dispatch = useDispatch();

  dispatch(setUsername(username));

  return (
    <div className={'typing-container'}>
      <p>{loginMessage('0.0.0.0', username)}</p>
    </div>
  );
};

export default LoginMessage;
