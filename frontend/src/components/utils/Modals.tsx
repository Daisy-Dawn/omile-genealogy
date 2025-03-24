/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete'
import Image from 'next/image'

interface AddFamilyModalProps {
    open: boolean
    handleClose: () => void
}

export const AddFamilyModal: React.FC<AddFamilyModalProps> = ({
    open,
    handleClose,
}) => {
    const [name, setName] = useState('')
    const [parent, setParent] = useState('')
    const [marriedTo, setMarriedTo] = useState<{ name: string }[]>([])
    const [children, setChildren] = useState<string[]>([])
    const [spouseInput, setSpouseInput] = useState('')
    const [childInput, setChildInput] = useState('')
    const [loading, setLoading] = useState(false)

    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'error' | 'success' | 'warning' | 'info'
    }>({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }))
    }

    // Function to reset all form fields
    const resetForm = () => {
        setName('')
        setParent('')
        setMarriedTo([])
        setChildren([])
        setSpouseInput('')
        setChildInput('')
    }

    // Add a spouse
    const addSpouse = () => {
        if (spouseInput.trim()) {
            setMarriedTo([...marriedTo, { name: spouseInput.trim() }])
            setSpouseInput('')
        }
    }

    // Add a child
    const addChild = () => {
        if (childInput.trim()) {
            setChildren([...children, childInput.trim()])
            setChildInput('')
        }
    }

    // Handle Enter key (desktop users)
    const handleEnterKey = (
        e: React.KeyboardEvent<HTMLInputElement>,
        callback: () => void
    ) => {
        if (e.key === 'Enter') callback()
    }

    // Remove spouse
    const removeSpouse = (index: number) => {
        setMarriedTo(marriedTo.filter((_, i) => i !== index))
    }

    // Remove child
    const removeChild = (index: number) => {
        setChildren(children.filter((_, i) => i !== index))
    }

    // Submit Data
    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Name field must not be empty!')
            return
        }

        const familyData = {
            name,
            parent,
            descendants: {
                marriedTo,
                children,
                grandchildren: [],
                greatgrandchildren: [],
            },
        }

        try {
            setLoading(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/family`,
                familyData
            )

            setSnackbar({
                open: true,
                message: response.data.message || 'Family added successfully!',
                severity: 'success',
            })
            resetForm()
            handleClose()
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'An error occurred!',
                severity: 'error',
            })
            console.error('Error adding family:', error)
            resetForm()
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="text-lg font-semibold">
                    Add Family
                </DialogTitle>
                <DialogContent
                    sx={{
                        maxHeight: '500px',
                        overflowY: 'auto', // Vertical scroll
                    }}
                >
                    <div className="flex flex-col gap-3">
                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <p>Name:</p>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Family Name"
                                className="w-full input-field py-2 px-2 rounded-[16px] border border-black bg-transparent text-black outline-none placeholder:text-gray-500 "
                                // className=""
                            />
                        </div>

                        {/* Parent */}
                        <div className="flex flex-col gap-1">
                            <p>Parent:</p>
                            <input
                                value={parent}
                                onChange={(e) => setParent(e.target.value)}
                                placeholder="Name of parent"
                                className="w-full input-field py-2 px-2 rounded-[16px] border border-black bg-transparent text-black outline-none placeholder:text-gray-500 "
                            />
                        </div>

                        {/* Married To */}
                        <div className="flex flex-col gap-1">
                            <p>Married To:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    value={spouseInput}
                                    onChange={(e) =>
                                        setSpouseInput(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleEnterKey(e, addSpouse)
                                    }
                                    placeholder="Enter spouse name"
                                    className="w-full input-field py-2 px-2 rounded-[16px] border border-black bg-transparent text-black outline-none placeholder:text-gray-500 "
                                />
                                <button
                                    onClick={addSpouse}
                                    className="button-home text-white px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                            {marriedTo.map((spouse, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span>{spouse.name}</span>
                                    <button
                                        onClick={() => removeSpouse(index)}
                                        className="text-red-500"
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Children */}
                        <div className="flex flex-col gap-1">
                            <p>Children:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    value={childInput}
                                    onChange={(e) =>
                                        setChildInput(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleEnterKey(e, addChild)
                                    }
                                    placeholder="Enter child name"
                                    className="w-full input-field py-2 px-2 rounded-[16px] border border-black bg-transparent text-black outline-none placeholder:text-gray-500 "
                                />
                                <button
                                    onClick={addChild}
                                    className="button-home text-white px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>

                            {children.map((child, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span>{child}</span>
                                    <button
                                        onClick={() => removeChild(index)}
                                        className="text-red-500"
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>

                <DialogActions>
                    {/* Buttons */}
                    <div className="flex justify-between w-full mt-4">
                        <button
                            onClick={handleClose}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="button-home text-white px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </DialogActions>
            </Dialog>
            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

// Define Family Type
interface Family {
    _id: string
    name: string
    parent?: string
    descendants: {
        marriedTo: { _id: string; name: string; picture: string }[]
        children: { _id: string; name: string; bio: string; picture: string }[]
        grandchildren: any[]
        greatgrandchildren: any[]
    }
    bio?: string
    picture?: string
}

// Define Component Props
interface DeleteFamilyModalProps {
    open: boolean
    onClose: () => void
    onDelete: (id: string) => void
}

export const DeleteFamilyModal: React.FC<DeleteFamilyModalProps> = ({
    open,
    onClose,
    onDelete,
}) => {
    const [families, setFamilies] = useState<Family[]>([])
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'error' | 'success' | 'warning' | 'info'
    }>({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }))
    }

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get<{ data: Family[] }>(
                    `${process.env.NEXT_PUBLIC_API_URL}/family`
                )
                setFamilies(response.data.data) // Ensure response.data.data contains the array
            } catch (error) {
                console.error('Error fetching families:', error)
            }
        }
        fetchFamilies()
    }, [])

    const handleDelete = async () => {
        if (!selectedFamily) return
        setLoading(true)
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/family/${selectedFamily._id}`
            )
            onDelete(selectedFamily._id)
            setSnackbar({
                open: true,
                message:
                    response.data.message || 'Family deleted successfully!',
                severity: 'success',
            })
            setFamilies((prevFamilies) =>
                prevFamilies.filter(
                    (family) => family._id !== selectedFamily._id
                )
            )
            setSelectedFamily(null)
            onClose()
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'An error occurred!',
                severity: 'error',
            })
            console.error('Error deleting family:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle className="text-lg font-semibold">
                    Delete Family
                </DialogTitle>
                <DialogContent
                    sx={{
                        maxHeight: '500px',
                        overflowY: 'auto', // Vertical scroll
                    }}
                >
                    <Autocomplete
                        options={families}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) =>
                            setSelectedFamily(newValue)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Family"
                                variant="outlined"
                            />
                        )}
                    />
                    {selectedFamily && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-md">
                            {/* Parent */}
                            <p>
                                <strong>Parent:</strong>{' '}
                                {selectedFamily.parent || 'Unknown'}
                            </p>

                            {/* Bio */}
                            <p>
                                <strong>Bio:</strong>{' '}
                                {selectedFamily.bio || 'No bio available'}
                            </p>

                            {/* Picture */}
                            {selectedFamily.picture && (
                                <div className="w-[150px] h-[150px] mt-2 rounded-md overflow-hidden">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={selectedFamily.picture}
                                        alt={selectedFamily.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Married To */}
                            <p>
                                <strong>Married To:</strong>{' '}
                                {selectedFamily.descendants.marriedTo.length > 0
                                    ? selectedFamily.descendants.marriedTo
                                          .map((spouse) => spouse.name)
                                          .join(', ')
                                    : 'N/A'}
                            </p>

                            {/* Children */}
                            <p>
                                <strong>Children:</strong>{' '}
                                {selectedFamily.descendants.children.length > 0
                                    ? selectedFamily.descendants.children
                                          .map((child) => child.name)
                                          .join(', ')
                                    : 'None'}
                            </p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <button
                        className="bg-blue-500 text-white disabled:bg-gray-400 px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white disabled:bg-gray-400 px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
                        onClick={handleDelete}
                        // color="error"
                        disabled={!selectedFamily || loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

interface UpdateFamilyModalProps {
    open: boolean
    onClose: () => void
}

interface Family2 {
    _id: string
    name: string
    bio?: string
    descendants: {
        marriedTo: { name: string }[]
        children: { name: string }[]
    }
}

export const UpdateFamilyDialog: React.FC<UpdateFamilyModalProps> = ({
    open,
    onClose,
}) => {
    const [families, setFamilies] = useState<Family2[]>([])
    const [selectedFamily, setSelectedFamily] = useState<Family2 | null>(null)
    const [updatedData, setUpdatedData] = useState({
        name: '',
        bio: '',
        marriedTo: [''], // Always have one input at minimum
        children: [''], // Ensure at least one input field
    })
    const [loading, setLoading] = useState(false)

    const [isChanged, setIsChanged] = useState(false)

    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'error' | 'success' | 'warning' | 'info'
    }>({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }))
    }

    const checkIfChanged = (newData: typeof updatedData) => {
        if (!selectedFamily) return false

        return (
            newData.name !== selectedFamily.name ||
            newData.bio !== (selectedFamily.bio || '') ||
            JSON.stringify(newData.marriedTo) !==
                JSON.stringify(
                    selectedFamily.descendants.marriedTo.map(
                        (spouse) => spouse.name
                    )
                ) ||
            JSON.stringify(newData.children) !==
                JSON.stringify(
                    selectedFamily.descendants.children.map(
                        (child) => child.name
                    )
                )
        )
    }

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/family`
                )
                setFamilies(response.data.data)
            } catch (error) {
                console.error('Error fetching families:', error)
            }
        }
        fetchFamilies()
    }, [])

    const handleFamilySelect = (event: any, newValue: Family2 | null) => {
        if (newValue) {
            setSelectedFamily(newValue)
            setUpdatedData({
                name: newValue.name,
                bio: newValue.bio || '',
                marriedTo:
                    newValue.descendants.marriedTo.length > 0
                        ? newValue.descendants.marriedTo.map(
                              (spouse) => spouse.name
                          )
                        : [''], // Ensure at least one input field
                children:
                    newValue.descendants.children.map((child) => child.name) ||
                    [],
            })
        }
    }

    const handleChange = (field: string, value: string) => {
        setUpdatedData((prev) => {
            const newData = { ...prev, [field]: value }
            setIsChanged(checkIfChanged(newData))
            return newData
        })
    }

    const handleListChange = (
        field: 'marriedTo' | 'children',
        index: number,
        value: string
    ) => {
        setUpdatedData((prev) => {
            const updatedList = [...prev[field]]
            updatedList[index] = value
            const newData = { ...prev, [field]: updatedList }
            setIsChanged(checkIfChanged(newData))
            return newData
        })
    }

    const addNewSpouse = () => {
        setUpdatedData((prev) => ({
            ...prev,
            marriedTo: [...prev.marriedTo, ''],
        }))
    }

    const addNewChild = () => {
        setUpdatedData((prev) => ({
            ...prev,
            children: [...prev.children, ''],
        }))
    }

    const updateFamily = async () => {
        if (!selectedFamily) return

        setLoading(true) // Start loading
        try {
            const formattedData = {
                name: updatedData.name,
                bio: updatedData.bio,
                descendants: {
                    marriedTo: updatedData.marriedTo
                        .filter((name) => name.trim() !== '') // Remove empty names
                        .map((name) => ({ name })), // Convert to object format
                    children: updatedData.children
                        .filter((name) => name.trim() !== '')
                        .map((name) => ({ name })), // Convert to object format
                    // grandchildren: [], // Ensure this field is included
                    // greatgrandchildren: [], // Ensure this field is included
                },
            }

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/family/${selectedFamily._id}`,
                formattedData
            )
            setSnackbar({
                open: true,
                message:
                    response.data.message || 'Family updated successfully!',
                severity: 'success',
            })

            // Update families list
            setFamilies((prev) =>
                prev.map((fam) =>
                    fam._id === selectedFamily._id ? response.data : fam
                )
            )

            // Clear inputs
            setSelectedFamily(null)
            setUpdatedData({
                name: '',
                bio: '',
                marriedTo: [''],
                children: [''],
            })
            setIsChanged(false)

            onClose()
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'An error occurred!',
                severity: 'error',
            })
            console.error('Update failed:', error)
        } finally {
            setLoading(false) // Stop loading
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Update Family</DialogTitle>
                <DialogContent
                    sx={{
                        maxHeight: '500px',
                        overflowY: 'auto', // Vertical scroll
                    }}
                >
                    <Autocomplete
                        options={families}
                        getOptionLabel={(option) => option.name}
                        onChange={handleFamilySelect}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Family"
                                variant="outlined"
                            />
                        )}
                    />
                    {selectedFamily && (
                        <>
                            <Box className="flex flex-col mt-3 gap-4">
                                <TextField
                                    fullWidth
                                    label="Family Name"
                                    value={updatedData.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    className="mt-3"
                                />
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    multiline
                                    rows={2}
                                    value={updatedData.bio}
                                    onChange={(e) =>
                                        handleChange('bio', e.target.value)
                                    }
                                    className="mb-3"
                                />

                                <Box>
                                    <p className="text-sm mb-3 font-semibold">
                                        Married To:
                                    </p>
                                    {updatedData.marriedTo.map(
                                        (spouse, index) => (
                                            <div className="mb-3" key={index}>
                                                {' '}
                                                <TextField
                                                    fullWidth
                                                    label={`Spouse ${
                                                        index + 1
                                                    }`}
                                                    value={spouse}
                                                    onChange={(e) =>
                                                        handleListChange(
                                                            'marriedTo',
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                    <Button
                                        onClick={addNewSpouse}
                                        variant="outlined"
                                        size="small"
                                        sx={{ marginTop: 1 }}
                                    >
                                        + Add Spouse
                                    </Button>
                                </Box>

                                <Box>
                                    <p className="text-sm mb-3 font-semibold">
                                        Children:
                                    </p>
                                    {updatedData.children.map(
                                        (child, index) => (
                                            <div className="mb-3" key={index}>
                                                <TextField
                                                    fullWidth
                                                    label={`Child ${index + 1}`}
                                                    value={child}
                                                    onChange={(e) =>
                                                        handleListChange(
                                                            'children',
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                    <Button
                                        onClick={addNewChild}
                                        variant="outlined"
                                        size="small"
                                        sx={{ marginTop: 1 }}
                                    >
                                        + Add Child
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <button
                        className=" text-white bg-red-500 px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 text-white disabled:bg-gray-400 px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
                        onClick={updateFamily}
                        disabled={!isChanged || loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}
