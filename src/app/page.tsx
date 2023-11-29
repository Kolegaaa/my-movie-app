'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getDatabase, ref, remove } from 'firebase/database';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

interface Review {
    id: string;
    title: string;
    imdb: string;
    rating: number;
    imgUrl?: string;
}

const Home = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [title, setTitle] = useState('');
    const [imdb, setImdb] = useState('');
    const [rating, setRating] = useState('');
    const [imgUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [update, setUpdate] = useState<[]>([]);

    const deleteReview = async (reviewId: any) => {
        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            console.log('Recension raderad');
            if (confirm('Do you want to delete this task')) {
                setReviews(reviews.filter((review) => review.id !== reviewId));
            }
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    const updateReview = async (reviewId: string, updateData: { title: string; imdb: string; rating: number; imgUrl: string }) => {
        try {
            await updateDoc(doc(db, 'reviews', reviewId), updateData);
            if(updateData){
                
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    useEffect(() => {
        async function fetchDataFromFirestore() {
            const querySnapshot = await getDocs(collection(db, 'reviews'));
            const data: Review[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...(doc.data() as Review), id: doc.id });
            });

            return data;
        }

        const fetchData = async () => {
            try {
                const data = await fetchDataFromFirestore();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !imdb || !imgUrl) {
            alert('Vänligen fyll fälten');
            return;
        }

        if (Number(rating) > 5) {
            setError('Rating kan inte vara högre än 5.');
            return;
        }

        try {
            await addDoc(collection(db, 'reviews'), {
                title,
                imdb,
                rating: Number(rating),
                imgUrl,
            });

            alert('Du har lagt till recension');

            setTitle('');
            setImdb('');
            setRating('');
            setImageUrl('');
            setError('');
        } catch (error) {
            console.error('Error ', error);
            setError('Kunde inte lägga till recensionen. Försök igen senare.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="Filmens titel" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="IMDB-länk" value={imdb} onChange={(e) => setImdb(e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="number" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Bild" value={imgUrl} onChange={(e) => setImageUrl(e.target.value)} className="p-2 border border-gray-300 rounded" />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Lägg till Recension
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <h2>Recensioner</h2>
            <div>
                {reviews.map((review, index) => (
                    <div key={review.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
                        {review.imgUrl && <img className="w-full h-40 object-cover" src={review.imgUrl} alt="Filmens poster" />}
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{review.title}</div>
                            <p className="text-gray-700 text-base">
                                IMDB-länk:{' '}
                                <a href={review.imdb} target="_blank" rel="noopener noreferrer">
                                    {review.imdb}
                                </a>
                            </p>
                            <p className="text-gray-700 text-base">Rating: {review.rating}</p>
                            <button className="Button" onClick={() => deleteReview(review.id)}>
                                Ta bort
                            </button>
                            <button className="Button" onClick={() => updateReview(review.id, {
                              title: title, imdb: imdb, rating: Number(rating),
                              imgUrl: ''
                            })}>
                                Uppdate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Home;
