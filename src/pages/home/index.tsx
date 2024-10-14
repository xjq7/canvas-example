import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    name: '练习',
    path: '/practice',
  },
  {
    name: '翻书',
    path: '/pageflip',
  },
  {
    name: '拼图',
    path: '/jigsaw',
  },
];

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center gap-[15px]">
      {data.map((page) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              navigate(page.path);
            }}
          >
            {page.name}
          </Button>
        );
      })}
    </div>
  );
}
