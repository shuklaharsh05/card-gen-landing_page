import { useParams } from 'react-router-dom';

export default function PublicCard() {
  const { id } = useParams();
  const src = `https://teamserver.cloud/cards/${id}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto">
        <div className="">
          {/* <div className="px-4 py-3 border-b border-slate-200">
            <h1 className="text-lg font-semibold text-slate-900">Public Card</h1>
          </div> */}
          <div className="">
            <iframe
              title="Public Card"
              src={src}
              className="w-full h-screen"
              allowTransparency
              allow="web-share; clipboard-write"
              sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-clipboard-write"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


