import React from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button, Input, Progress } from '@nextui-org/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { postFile } from '../../api/apiFunctions';
import { sweetToast } from './Alerts';

const FileUpload = ({ from, object_id, loadData }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [file, setFile] = React.useState(null);
    const [name, setName] = React.useState('');
    const fileInputRef = React.useRef(null);
    const [isInvalid, setIsInvalid] = React.useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) return;

        if (name.length !== 0) {
            setIsLoading(true);
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error) => {
                    console.error('Upload error: ', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // Save the URL in the backend
                        postFile({
                            file_url: downloadURL,
                            name: name,
                            content_type: (from === 'PT' ? 10 : 12),
                            object_id: object_id
                        })
                            .then(() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = null;
                                }
                                setFile(null);
                                sweetToast('success', `${name} se ha guardado correctamente`);
                                setName('');
                                setIsLoading(false);
                                loadData();
                            })
                            .catch((error) => console.error('Error:', error));
                    });
                }
            );
        }
        else {
            setIsInvalid(true);
        }
    };

    return (
        <div className='flex flex-row items-center mb-2'>
            <div className='flex flex-col gap-5 w-full'>
                <Input
                    label='Nombre'
                    variant='underlined'
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (name.length > 0) {
                            setIsInvalid(false);
                        }
                    }}
                    isInvalid={isInvalid}
                />
                <input
                    className="w-full bg-sidebar rounded-sm"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                />
                <Progress
                    className={`${!isLoading ? 'hidden' : ''}`}
                    size="sm"
                    aria-label="Loading..."
                    value={progress} />
            </div>
            <Button onClick={handleUpload} isIconOnly variant='light' isLoading={isLoading}>
                <PlusIcon className='w-5 h-5 cursor-pointer' />
            </Button>
        </div>
    );
};

export default FileUpload;