import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Jigsaw from './pages/jigsaw';
import Pageflip from './pages/pageflip';
import Practice from './pages/practice';
import MineSweeper from './pages/minesweeper';
import G2048 from './pages/2048';
import Editor from './pages/editor';
import Clock from './pages/clock';
import ShapeEditor from './pages/shape-editor';
import Snowflake from './pages/snowflake';
import MarchingMusic from './pages/marching-music';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/jigsaw',
    element: <Jigsaw />,
  },
  {
    path: '/pageflip',
    element: <Pageflip />,
  },
  {
    path: '/practice',
    element: <Practice />,
  },
  {
    path: '/minesweeper',
    element: <MineSweeper />,
  },
  {
    path: '/2048',
    element: <G2048 />,
  },
  {
    path: '/editor',
    element: <Editor />,
  },
  {
    path: '/clock',
    element: <Clock />,
  },
  {
    path: '/shape-editor',
    element: <ShapeEditor />,
  },
  {
    path: '/snowflake',
    element: <Snowflake />,
  },
  {
    path: '/marching-music',
    element: <MarchingMusic />,
  },
]);

export default function Component() {
  return <RouterProvider router={router} />;
}
