import { useState } from 'react';

function Post({ id, author, body, onEdit, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedBody, setEditedBody] = useState(body);

	function startEditHandler() {
		setIsEditing(true);
	}

	function changeHandler(event) {
		setEditedBody(event.target.value);
	}

	async function saveEditHandler() {
		await onEdit(id, editedBody);
		setIsEditing(false);
	}

	function cancelEditHandler() {
		setIsEditing(false);
		setEditedBody(body); // Reset input
	}

	return (
		<li className='post'>
			<p className='author'>{author}</p>

			{isEditing ? (
				<>
					<textarea value={editedBody} onChange={changeHandler} />
					<button onClick={saveEditHandler}>Save</button>
					<button onClick={cancelEditHandler}>Cancel</button>
				</>
			) : (
				<>
					<p className='text'>{body}</p>
					<button onClick={startEditHandler}>Edit</button>
					<button onClick={() => onDelete(id)}>Delete</button>
				</>
			)}
		</li>
	);
}

export default Post;
