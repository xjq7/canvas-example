import Router from './router';
import GithubSvg from './assets/github.svg';

export default function Component() {
  return (
    <div>
      <Router />
      <a
        className="w-[50px] h-[50px] flex items-center justify-center fixed right-0 top-0 cursor-pointer z-[999] "
        href="https://github.com/xjq7/canvas-example"
        target="_blank"
      >
        <img src={GithubSvg} className="w-[40px] h-[40px] bg-white" />
      </a>
    </div>
  );
}
