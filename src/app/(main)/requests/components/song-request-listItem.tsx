'use client';

import { SongRequest } from '../../../types';

interface SongRequestListItemProps {
  request: SongRequest;
}

export default function SongRequestListItem({ request }: SongRequestListItemProps) {
  return (
    <div className={`relative bg-gray-900 border border-gray-700 rounded-lg p-4 ${request.played ? 'opacity-60' : ''}`}>
      {/* Played overlay */}
      {request.played && (
        <div className="absolute top-2 right-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">✓ PLAYED</span>
        </div>
      )}

      <div className="flex items-center">
        {/* Song Info */}
        <div className="flex items-center flex-grow min-w-0">
          <div className="w-16 h-16 mr-4 flex-shrink-0">
            <img src={request.track.image} alt={request.track.title} className="w-full h-full object-cover rounded" />
          </div>
          <div className="min-w-0 flex-grow">
            <h3 className="text-white font-medium truncate">{request.track.title}</h3>
            <p className="text-gray-400 text-sm truncate">{request.track.artists}</p>
            {request.track.album && <p className="text-gray-500 text-xs truncate">{request.track.album}</p>}
          </div>
        </div>
      </div>

      {/* Request Info */}
      <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
        <span>
          Requested{' '}
          {new Date(request.createdDate).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {request.requestedById && <span className="text-gray-400">By: {request.requestedById}</span>}
      </div>
    </div>
  );
}
