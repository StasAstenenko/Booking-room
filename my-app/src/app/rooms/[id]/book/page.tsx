'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { createBooking } from '@/lib/booking';

const CreateBookingPage = () => {
  const { id: roomId } = useParams();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const user = auth.currentUser;
    if (!user || !roomId) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      await createBooking({
        roomId: roomId as string,
        start,
        end,
        createdBy: user.email || '',
        description,
      });

      router.push(`/rooms/${roomId}`);
    } catch (err) {
      setError(true);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const handleClickBack = () => {
    return router.push('/dashboard');
  };

  return (
    <main className='p-6 max-w-xl mx-auto'>
      <button
        onClick={handleClickBack}
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Назад
      </button>
      <h1 className='text-2xl font-bold mb-4'>Нове бронювання</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <input
          type='time'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <input
          type='time'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <textarea
          placeholder='Опис'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='border p-2 rounded'
        />
        {error && <p className='text-red-600'>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Збереження...' : 'Забронювати'}
        </button>
      </form>
    </main>
  );
};

export default CreateBookingPage;
