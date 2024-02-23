import React, { useEffect } from 'react'
import axios from 'axios'
import CardComp from '@/components/CardComp'

interface User{
  id: number
  name: string
  email: string
}

export default function Index() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const [users, setUsers] = React.useState<User[]>([])
  const [newUser, setNewUser] = React.useState({name: '', email: ''})
  const [updateUser, setUpdateUser] = React.useState({id: '', name: '', email: ''})

  //fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    fetchData(); // This line is added to call the fetchData function.
  }, []); // Add an empty dependency array here.


  //create user
  const createUser = async (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({name: '', email: ''});
    } catch (error) {
      console.log('Error creating user:', error);
    }
  }

  //update user
  const handleUpdateUser = async (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    try{
      await axios.put(`${apiUrl}/users/${updateUser.id}`, {name: updateUser.name, email: updateUser.email, id: updateUser});
      setUpdateUser({id: '', name: '', email: ''});
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      )
    }  catch (error) {
      console.error('Error updating user:', error);
    }
  }

  //delete user
  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>

      {/* Create User */}
      <form onSubmit={createUser} className="p-4 bg-blue-200 rounded shadow">
        <input
          placeholder='Name'
          value={newUser.name}  
          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          />

        <input
          placeholder='Email'
          value={newUser.email}  
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded">
          Add User
        </button>
      </form>

      {/* Update User */}
      <form onSubmit={handleUpdateUser} className="p-4 bg-green-200 rounded shadow">
        <input
          placeholder='User ID'
          value={updateUser.id}  
          onChange={(e) => setUpdateUser({...updateUser, id: e.target.value})}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
        <input
          placeholder='New Email'
          value={updateUser.email}  
          onChange={(e) => setUpdateUser({...updateUser, email: e.target.value})}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
        <input
          placeholder='New Name'
          value={updateUser.name}  
          onChange={(e) => setUpdateUser({...updateUser, name: e.target.value})}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded">
          Update User
        </button>
      </form>

      {/* Display Users */}
      <div className='space-y-2'>
        {users.map((user)=>(
            <div key={user.id} className='flex items-center justify-between bg-white p-4 rounded-lg shadow'>
              <CardComp card={user} />
              
              <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}
      </div>


      </div>
    </main>
  )
}
