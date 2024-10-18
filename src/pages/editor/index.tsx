import Editor from './components/editor';
import Header from './components/header';
import Material from './components/material';
import Setting from './components/setting';

export default function Component() {
  return (
    <div className="bg-[#f2f3f5] h-[100vh] w-[100vw]">
      <Header />
      <Material />
      <Editor />
      <Setting />
    </div>
  );
}
