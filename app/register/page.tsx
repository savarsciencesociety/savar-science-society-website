"use client"

import { useState, useEffect } from "react" // 1. Import useEffect

const RegisterPage = () => {
  const [image, setImage] = useState(null)
  const [error, setError] = useState("")

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
      if (image) {
        URL.revokeObjectURL(image);
      }
      setImage(URL.createObjectURL(file))
      setError("")
    } else {
      setError("Please upload a valid image file.")
    }
  }

  // 2. Add useEffect for cleanup
  useEffect(() => {
    // This is the cleanup function that will run when the component unmounts
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]); // The effect depends on the `image` state

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    // ... your JSX remains the same
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <label htmlFor="imageUpload">Profile Image:</label>
        <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Register</button>
      </form>
      {image && <img src={image} alt="Profile Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
    </div>
  )
}

export default RegisterPage
