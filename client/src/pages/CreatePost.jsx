import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
// Import specific components from the Flowbite React library for UI elements like alerts, buttons, file inputs, selects, and text inputs.

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Import the ReactQuill component, which is a rich text editor, along with its styles.

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
// Import Firebase storage functions: getDownloadURL (to get the URL of an uploaded file), 
// getStorage (to initialize Firebase storage), ref (to create a reference for a file in storage), 
// and uploadBytesResumable (to handle the file upload with progress tracking).

import { app } from '../firebase';
// Import your Firebase configuration, which is initialized in the 'firebase.js' file.

import { useState } from 'react';
// Import the useState hook from React, which allows you to use state in functional components.

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// Import the CircularProgressbar component and its styles, used for displaying the image upload progress.

import { useNavigate } from 'react-router-dom';
// Import the useNavigate hook from React Router to programmatically navigate between routes.

export default function CreatePost() {
  const [file, setFile] = useState(null);
  // State to store the selected file (image) for upload.
  
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  // State to store the progress of the image upload.

  const [imageUploadError, setImageUploadError] = useState(null);
  // State to store any errors that occur during the image upload process.

  const [formData, setFormData] = useState({});
  // State to store the form data, which includes the title, category, content, and uploaded image URL.

  const [publishError, setPublishError] = useState(null);
  // State to store any errors that occur during the post publishing process.

  const navigate = useNavigate();
  // Hook to get the navigate function, allowing you to redirect the user after the post is published.

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        // If no file is selected, set an error message and return early.
        return;
      }
      setImageUploadError(null);
      // Clear any existing image upload error.
      
      const storage = getStorage(app);
      // Initialize Firebase storage using the app configuration.
      
      const fileName = new Date().getTime() + '-' + file.name;
      // Create a unique filename using the current timestamp and the original file name to avoid conflicts.
      
      const storageRef = ref(storage, fileName);
      // Create a reference in Firebase storage with the unique filename.
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Start uploading the file with progress tracking.

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Calculate the upload progress as a percentage.

          setImageUploadProgress(progress.toFixed(0));
          // Update the state with the current upload progress.
        },
        (error) => {
          setImageUploadError('Image upload failed');
          // If an error occurs during upload, set an error message.

          setImageUploadProgress(null);
          // Reset the upload progress state.
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Once the upload is complete, get the download URL for the uploaded image.

            setImageUploadProgress(null);
            // Reset the upload progress state.

            setImageUploadError(null);
            // Clear any existing image upload error.

            setFormData({ ...formData, image: downloadURL });
            // Update the form data state with the image's download URL.
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      // If an exception occurs during the upload process, set an error message.

      setImageUploadProgress(null);
      // Reset the upload progress state.

      console.log(error);
      // Log the error to the console for debugging purposes.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent the default form submission behavior.

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send a POST request to the backend API to create a new post.
        // Set the request headers to indicate the content type is JSON.

        body: JSON.stringify(formData),
        // Convert the formData state into a JSON string and include it in the request body.
      });

      const data = await res.json();
      // Parse the JSON response from the server.

      if (!res.ok) {
        setPublishError(data.message);
        // If the response is not OK (e.g., 400 or 500 status), set an error message from the response.

        return;
      }

      if (res.ok) {
        setPublishError(null);
        // If the response is OK, clear any existing publish error.

        navigate(`/post/${data.slug}`);
        // Navigate to the newly created post's page using its slug.
      }
    } catch (error) {
      setPublishError('Something went wrong');
      // If an exception occurs during the fetch request, set a generic error message.
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      {/* Container div with padding, maximum width, centered content, and minimum height styles */}
      
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      {/* Heading for the form, centered and styled with a larger font size and margin */}
      
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Form element with flexbox layout, column direction, and gap between elements */}
        
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          {/* Div for grouping the title input and category select elements, 
              with responsive layout (column on small screens, row on larger screens) */}

          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {/* Text input for the post title, required field, with an event handler to update the formData state */}

          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
          {/* Select input for choosing a category, with an event handler to update the formData state */}
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          {/* Div for grouping the file input and upload button, styled with dotted borders and padding */}
          
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          {/* File input for selecting an image file, with an event handler to update the file state */}

          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
          {/* Button to trigger the image upload process. If an image is uploading, display the progress bar instead of the button text. */}
        </div>

        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {/* Display an alert if there's an error with the image upload */}

        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        {/* If an image has been uploaded successfully, display it below the file input */}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {/* Rich text editor for the post content, required field, with an event handler to update the formData state */}

        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {/* Submit button to publish the post */}

        {publishError && <Alert color='failure'>{publishError}</Alert>}
        {/* Display an alert if there's an error during the post publishing process */}
      </form>
    </div>
  );
}