import { useEffect, useState, useCallback } from 'react';
import Post from './Post';
import NewPost from './NewPost';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

function PostsList({ isPosting, onStopPosting }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch posts from backend
	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('http://localhost:8080/posts');
			if (!response.ok) throw new Error('Failed to fetch posts.');

			const resData = await response.json();
			setPosts(resData.posts);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch posts when the component loads
	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	// Add new post
	async function addPostHandler(postData) {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:8080/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(postData),
			});

			if (!response.ok) throw new Error('Failed to add post.');

			fetchPosts(); // Refresh posts
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	// Edit post
	async function editPostHandler(postId, updatedBody) {
		try {
			const response = await fetch(`http://localhost:8080/posts/${postId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ body: updatedBody }),
			});

			if (!response.ok) throw new Error('Failed to edit post.');

			fetchPosts(); // Refresh posts
		} catch (err) {
			setError(err.message);
		}
	}

	// Delete post
	async function deletePostHandler(postId) {
		try {
			const response = await fetch(`http://localhost:8080/posts/${postId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete post.');

			fetchPosts(); // Refresh posts
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<>
			{isPosting && (
				<Modal onCloseModal={onStopPosting}>
					<NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
				</Modal>
			)}

			{loading && <LoadingSpinner />}

			{error && (
				<div style={{ textAlign: 'center', color: 'red' }}>
					<h2>Error: {error}</h2>
					<p>Please try again later.</p>
				</div>
			)}

			{!loading && !error && posts.length > 0 && (
				<ul className='posts'>
					{posts.map((post) => (
						<Post
							key={post.id}
							id={post.id}
							author={post.author}
							body={post.body}
							onEdit={editPostHandler}
							onDelete={deletePostHandler}
						/>
					))}
				</ul>
			)}

			{!loading && !error && posts.length === 0 && (
				<div style={{ textAlign: 'center', color: 'white' }}>
					<h2>No posts yet.</h2>
					<p>Try adding some!</p>
				</div>
			)}
		</>
	);
}

export default PostsList;
