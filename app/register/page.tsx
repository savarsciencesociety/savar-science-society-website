"use client"

import { useState } from "react"

const RegisterPage = () => {
  const [image, setImage] = useState(null)
  const [error, setError] = useState("")

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file))
      setError("")
    } else {
      setError("Please upload a valid image file.")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission logic here
  }

  return (
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
      {image && <img src={image || "/placeholder.svg"} alt="Profile Preview" />}
    </div>
  )
}

export default RegisterPage
