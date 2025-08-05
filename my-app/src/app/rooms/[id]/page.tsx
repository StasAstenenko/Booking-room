'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/client';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

interface Room {
  id: string;
  name: string;
  description: string;
  roles: Record<string, 'admin' | 'user'>;
}

interface BookingDisplay {
  id: string;
  roomId: string;
  userEmail: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

const RoomDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'user'>('user');

  const fetchRoom = async () => {
    const docRef = doc(db, 'rooms', id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Room, 'id'>;
      const fullRoom: Room = { id: docSnap.id, ...data };
      setRoom(fullRoom);

      const userEmail = auth.currentUser?.email ?? null;
      if (userEmail && fullRoom.roles?.[userEmail]) {
        setUserRole(fullRoom.roles[userEmail]);
      } else {
        setUserRole(null);
      }
    }
  };

  const fetchBookings = async () => {
    const q = query(collection(db, 'bookings'), where('roomId', '==', id));
    const snapshot = await getDocs(q);

    const list: BookingDisplay[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      return {
        id: doc.id,
        roomId: data.roomId,
        userEmail: data.createdBy,
        description: data.description,
        date: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
      };
    });

    setBookings(list);
  };

  useEffect(() => {
    fetchRoom();
    fetchBookings();
  }, [id]);

  const handleAddMember = async () => {
    if (!room || !auth.currentUser?.email || userRole !== 'admin') return;

    const docRef = doc(db, 'rooms', id as string);
    await updateDoc(docRef, {
      [`roles.${newMemberEmail}`]: newMemberRole,
    });

    setNewMemberEmail('');
    setNewMemberRole('user');
    fetchRoom();
  };

  const handleDeleteRoom = async () => {
    if (!room || userRole !== 'admin') return;

    await deleteDoc(doc(db, 'rooms', id as string));
    router.push('/dashboard');
  };

  const handleClickBack = () => {
    return router.push('/dashboard');
  };

  if (!room) return <p>Завантаження...</p>;

  return (
    <main className='p-6 max-w-4xl mx-auto'>
      <button
        onClick={handleClickBack}
        className='bg-blue-600 mb-2.5 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Назад
      </button>
      <h1 className='text-2xl font-bold mb-4'>{room.name}</h1>
      <p className='mb-2'>{room.description}</p>

      {userRole === 'admin' && (
        <>
          <div className='mt-6'>
            <h2 className='text-lg font-semibold mb-2'>Додати учасника</h2>
            <div className='flex gap-2'>
              <input
                type='email'
                placeholder='Email користувача'
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className='border p-2 rounded w-full'
              />
              <select
                value={newMemberRole}
                onChange={(e) =>
                  setNewMemberRole(e.target.value as 'admin' | 'user')
                }
                className='border p-2 rounded'
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
              <button
                onClick={handleAddMember}
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                Додати
              </button>
            </div>
          </div>

          <button
            onClick={handleDeleteRoom}
            className='mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
          >
            Видалити кімнату
          </button>
        </>
      )}

      <div className='mt-6'>
        <h2 className='text-lg font-semibold'>Учасники</h2>
        <ul className='mt-2 space-y-1'>
          {room.roles ? (
            Object.entries(room.roles).map(([email, role]) => (
              <li key={email} className='text-sm'>
                {email} — <strong>{role}</strong>
              </li>
            ))
          ) : (
            <li className='text-sm text-gray-500'>Учасників немає</li>
          )}
        </ul>
      </div>

      <div className='mt-6'>
        <h2 className='text-lg font-semibold'>Бронювання</h2>
        <ul className='mt-2 space-y-2'>
          {bookings.map((b) => (
            <li key={b.id} className='border p-3 rounded'>
              <p>
                <strong>Дата:</strong> {b.date}
              </p>
              <p>
                <strong>Час:</strong> {b.startTime} - {b.endTime}
              </p>
              <p>
                <strong>Користувач:</strong> {b.userEmail}
              </p>
              <p>
                <strong>Опис:</strong> {b.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default RoomDetailsPage;
