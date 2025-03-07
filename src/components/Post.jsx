import { useState } from 'react';

function Post({ id, author, body, onEdit, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedBody, setEditedBody] = useState(body);

	function editHandler() {
		setIsEditing(true);
	}

	function saveEditHandler() {
		onEdit(id, editedBody); // Send updated post to parent component
		setIsEditing(false); // Exit edit mode
	}

	return (
		<li className='post'>
			<p className='author'><strong>{author}</strong></p>

			{isEditing ? (
				<>
					<textarea
						value={editedBody}
						onChange={(e) => setEditedBody(e.target.value)}
					/>
					<button onClick={saveEditHandler}>Save</button>
					<button onClick={() => setIsEditing(false)}>Cancel</button>
				</>
			) : (
				<>
					<p className='text'>{body}</p>
					<button onClick={editHandler}>Edit</button>
					<button onClick={() => onDelete(id)}>Delete</button>
				</>
			)}
		</li>
	);
}

export default Post;
