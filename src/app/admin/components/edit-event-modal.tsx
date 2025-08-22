'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, MapPin, Clock, Save } from 'lucide-react';
import { updateEventStatus } from '../../(main)/requests/actions/dj-events';
import type { DjEventWithStats } from '../../(main)/requests/actions/dj-events';
import { format } from 'date-fns';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
  event: DjEventWithStats;
}

interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueAddress: string;
  isActive: boolean;
  isPublic: boolean;
}

export default function EditEventModal({ isOpen, onClose, onEventUpdated, event }: EditEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      name: event.name,
      description: event.description || '',
      startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm"),
      venueName: event.venueName || '',
      venueAddress: event.venueAddress || '',
      isActive: event.isActive,
      isPublic: event.isPublic,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    setError('');

    try {
      await updateEventStatus(event.id, {
        name: data.name,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        venueName: data.venueName || null,
        venueAddress: data.venueAddress || null,
        isActive: data.isActive,
        isPublic: data.isPublic,
      });

      onEventUpdated();
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Edit Event
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">{error}</div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Event Details</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Event name is required' })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter event name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter event description (optional)"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date & Time *
                </label>
                <input
                  id="startDate"
                  type="datetime-local"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-400">{errors.startDate.message}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                  End Date & Time *
                </label>
                <input
                  id="endDate"
                  type="datetime-local"
                  {...register('endDate', { required: 'End date is required' })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-400">{errors.endDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-400" />
              Venue Information
            </h3>

            <div>
              <label htmlFor="venueName" className="block text-sm font-medium text-gray-300 mb-2">
                Venue Name
              </label>
              <input
                id="venueName"
                type="text"
                {...register('venueName')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter venue name (optional)"
              />
            </div>

            <div>
              <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-300 mb-2">
                Venue Address
              </label>
              <input
                id="venueAddress"
                type="text"
                {...register('venueAddress')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter venue address (optional)"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Event Settings</h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  {...register('isPublic')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-300">
                  Make event public (visible to users)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                  Set as active event (currently accepting requests)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
