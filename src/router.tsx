import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Leafer from './pages/leafer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/leafer',
    element: <Leafer />,
  },
]);

export default function Component() {
  return <RouterProvider router={router} />;
}
