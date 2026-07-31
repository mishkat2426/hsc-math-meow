import React from 'react';

const CAT_AVATARS = ["🐱", "😸", "😻", "😽", "🐈", "🦁", "🐆", "🐾"];

export default function AvatarSelector({ selectedAvatar, onSelect }) {
  return (
    <div>
      <div className="cute-label">তোমার বিড়াল অবতার বেছে নাও 🐾:</div>
      <div className="avatar-grid">
        {CAT_AVATARS.map((avatar) => (
          <div
            key={avatar}
            className={`avatar-item ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => onSelect(avatar)}
          >
            {avatar}
          </div>
        ))}
      </div>
    </div>
  );
}
export { CAT_AVATARS };
