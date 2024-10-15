import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Leafer from './pages/leafer';
import Jigsaw from './pages/jigsaw';
import Pageflip from './pages/pageflip';
import Practice from './pages/practice';
import MineSweeper from './pages/minesweeper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/leafer',
    element: <Leafer />,
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
]);

export default function Component() {
  return <RouterProvider router={router} />;
}
