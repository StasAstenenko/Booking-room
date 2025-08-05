'use client';

import { auth, db } from '@/firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Rooms {
  id: string;
  name?: string;
  description?: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Rooms[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || user.email);

        // Fetch meeting rooms from Firestore
        const snapshot = await getDocs(collection(db, 'rooms'));
        const roomList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <main className='p-6 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>
          Привіт, {userName ? userName : 'Користувачу'}!
        </h1>
        <button
          onClick={handleLogout}
          className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
        >
          Вийти
        </button>
      </div>

      <div className='mb-4 flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Переговорні кімнати</h2>
        <button
          onClick={() => router.push('/rooms/new')}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          + Нова кімната
        </button>
      </div>

      <ul className='grid gap-4'>
        {rooms.map((room) => (
          <li
            key={room.id}
            className='border p-4 rounded shadow flex justify-between items-center'
          >
            <div>
              <h3 className='text-lg font-bold'>{room.name}</h3>
              <p className='text-sm text-gray-600'>{room.description}</p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => router.push(`/rooms/${room.id}`)}
                className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
              >
                Переглянути
              </button>
              <button
                onClick={() => router.push(`/rooms/${room.id}/book`)}
                className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600'
              >
                Забронювати
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default DashboardPage;
