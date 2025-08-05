'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/firebase/client';
import { useRouter } from 'next/navigation';

interface InfoRoom {
  name: string;
  description: string;
  createdBy: string;
  createdAt: number;
  roles: Record<string, 'admin' | 'user'>;
}

const CreateRoomPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user || !user.email) return;

    const infoRoom: InfoRoom = {
      name: name,
      description: description,
      createdBy: user.uid,
      createdAt: Date.now(),
      roles: {
        [user.email]: 'admin',
      },
    };

    await addDoc(collection(db, 'rooms'), infoRoom);

    router.push('/dashboard');
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
      <h1 className='text-2xl font-bold mb-4'>Нова переговорна кімната</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Назва кімнати'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <textarea
          placeholder='Опис кімнати'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='border p-2 rounded'
          rows={4}
        />
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Створити
        </button>
      </form>
    </main>
  );
};

export default CreateRoomPage;
