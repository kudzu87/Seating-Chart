import React, { useState, useRef, useEffect, useCallback } from 'react';
// Removed Firebase imports as cloud save functionality is removed
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, setDoc, onSnapshot, collection, query, getDocs } from 'firebase/firestore';

// Main App component
const App = () => {
    // State to hold all elements on the seating chart
    const [elements, setElements] = useState([]);
    // State to track the currently dragged element ID
    const [draggedElementId, setDraggedElementId] = useState(null);
    // State to store the initial mouse offset from the dragged element's origin
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    // Ref for the SVG canvas to get its position
    const svgRef = useRef(null);
    // Ref for the properties panel to get its dimensions
    const propertiesPanelRef = useRef(null);
    // Ref for the file input for uploading projects
    const fileInputRef = useRef(null);

    // State to track the currently selected element for property editing
    const [selectedElementId, setSelectedElementId] = useState(null);
    // State for dynamic positioning of the properties panel
    const [panelPosition, setPanelPosition] = useState({ top: 'auto', left: 'auto', right: 'auto', bottom: 20, opacity: 0 });

    // State for the guest name input modal
    const [showGuestNameModal, setShowGuestNameModal] = useState(false);
    const [guestNameInput, setGuestNameInput] = useState('');
    const [guestModalContext, setGuestModalContext] = useState(null);

    // State for the generic message modal (e.g., "Please select a chair")
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState('');

    // Removed Firestore and authentication states as cloud save is removed
    // const [db, setDb] = useState(null);
    // const [auth, setAuth] = useState(null);
    // const [userId, setUserId] = useState(null);
    // const [loading, setLoading] = useState(true); // Loading state for initial data fetch
    // const [saveStatus, setSaveStatus] = useState(''); // Status message for saving

    // Room dimensions
    const [roomWidth, setRoomWidth] = useState(800);
    const [roomHeight, setRoomHeight] = useState(600);

    // Grid size for snapping
    const gridSize = 25;

    // Get the currently selected element object
    const selectedElement = elements.find((el) => el.id === selectedElementId);

    // Removed Firebase Initialization and Authentication useEffect as cloud save is removed
    /*
    useEffect(() => {
        try {
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

            if (!firebaseConfig) {
                console.error("Firebase config not found.");
                setMessageModalContent("Firebase is not configured. Saving and loading will not work.");
                setShowMessageModal(true);
                setLoading(false);
                return;
            }

            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);

            setDb(firestore);
            setAuth(firebaseAuth);

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    loadProject(firestore, user.uid, appId);
                } else {
                    try {
                        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                        } else {
                            await signInAnonymously(firebaseAuth);
                        }
                    } catch (error) {
                        console.error("Firebase Anonymous Auth Error:", error);
                        setMessageModalContent(`Authentication failed: ${error.message}. Saving and loading may not work.`);
                        setShowMessageModal(true);
                        setLoading(false);
                    }
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase Initialization Error:", error);
            setMessageModalContent(`Error initializing app: ${error.message}. Saving and loading will not work.`);
            setShowMessageModal(true);
            setLoading(false);
        }
    }, []);
    */

    // Removed loadProject and saveProject functions and related useEffects as cloud save is removed
    /*
    const loadProject = useCallback(async (firestore, currentUserId, currentAppId) => {
        setLoading(true);
        try {
            const projectDocRef = doc(firestore, 'artifacts', currentAppId, 'users', currentUserId, 'seating_projects', 'current_project');

            const unsubscribe = onSnapshot(projectDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const savedData = docSnap.data();
                    if (savedData && savedData.elements) {
                        setElements(JSON.parse(savedData.elements));
                        setRoomWidth(savedData.roomWidth || 800);
                        setRoomHeight(savedData.roomHeight || 600);
                    } else {
                        setElements([]);
                    }
                } else {
                    setElements([]);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error listening to project document:", error);
                setMessageModalContent(`Error loading project from cloud: ${error.message}`);
                setShowMessageModal(true);
                setLoading(false);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Error setting up project listener:", error);
            setMessageModalContent(`Error setting up project listener: ${error.message}`);
            setShowMessageModal(true);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        let unsubscribe;
        if (db && userId) {
            unsubscribe = loadProject(db, userId, appId);
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [db, userId, loadProject]);

    const saveProject = useCallback(async () => {
        if (!db || !userId) {
            setMessageModalContent("Cannot save to cloud: Not authenticated or database not ready.");
            setShowMessageModal(true);
            return;
        }
        setSaveStatus("Saving to cloud...");
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const projectDocRef = doc(db, 'artifacts', appId, 'users', userId, 'seating_projects', 'current_project');

            const elementsString = JSON.stringify(elements);

            await setDoc(projectDocRef, {
                elements: elementsString,
                roomWidth: roomWidth,
                roomHeight: roomHeight,
                lastSaved: new Date()
            });
            setSaveStatus("Project saved to cloud!");
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error("Error saving project to cloud:", error);
            setSaveStatus("Cloud save failed!");
            setMessageModalContent(`Error saving project to cloud: ${error.message}`);
            setShowMessageModal(true);
            setTimeout(() => setSaveStatus(''), 3000);
        }
    }, [db, userId, elements, roomWidth, roomHeight]);
    */

    // Helper function to snap a coordinate to the grid
    const snapToGrid = (coord) => {
        return Math.round(coord / gridSize) * gridSize;
    };

    // Function to add a new element to the chart
    const addElement = (type, shape = 'round', guestName = '') => {
        let newPrimaryElement;
        const newElements = [];

        const currentSvgRect = svgRef.current?.getBoundingClientRect();
        const centerX = currentSvgRect ? currentSvgRect.width / 2 : roomWidth / 2;
        const centerY = currentSvgRect ? currentSvgRect.height / 2 : roomHeight / 2;

        const snappedCenterX = snapToGrid(centerX);
        const snappedCenterY = snapToGrid(centerY);

        if (type === 'table') {
            const tableId = `table-${Date.now()}`;
            let defaultWidth, defaultHeight;

            if (shape === 'round') {
                defaultWidth = 100;
                defaultHeight = 100;
            } else {
                defaultWidth = 50;
                defaultHeight = 100;
            }

            newPrimaryElement = {
                id: tableId,
                type: type,
                x: snappedCenterX,
                y: snappedCenterY,
                shape: shape,
                width: defaultWidth,
                height: defaultHeight,
                rotation: 0,
                tableNumber: '',
            };
            newElements.push(newPrimaryElement);

            const chairDistance = 20;

            if (shape === 'round') {
                const defaultChairCount = 8;
                const tableRadius = Math.max(1, defaultWidth / 2);
                const chairOffset = tableRadius + chairDistance;

                for (let i = 0; i < defaultChairCount; i++) {
                    const angle = (i / defaultChairCount) * 2 * Math.PI;
                    const chairX = snappedCenterX + chairOffset * Math.cos(angle);
                    const chairY = snappedCenterY + chairOffset * Math.sin(angle);
                    newElements.push({
                        id: `chair-${Date.now()}-${i}`,
                        type: 'chair',
                        x: snapToGrid(chairX),
                        y: snapToGrid(chairY),
                        parentId: tableId,
                        guestName: '',
                    });
                }
            } else {
                const chairsPerSide = 4;
                const halfWidth = defaultWidth / 2;
                const halfHeight = defaultHeight / 2;

                for (let i = 0; i < chairsPerSide; i++) {
                    const yOffset = -halfHeight + (i + 0.5) * (defaultHeight / chairsPerSide);
                    newElements.push({
                        id: `chair-${Date.now()}-left-${i}`,
                        type: 'chair',
                        x: snapToGrid(snappedCenterX - halfWidth - chairDistance),
                        y: snapToGrid(snappedCenterY + yOffset),
                        parentId: tableId,
                        guestName: '',
                    });
                    newElements.push({
                        id: `chair-${Date.now()}-right-${i}`,
                        type: 'chair',
                        x: snapToGrid(snappedCenterX + halfWidth + chairDistance),
                        y: snapToGrid(snappedCenterY + yOffset),
                        parentId: tableId,
                        guestName: '',
                    });
                }
            }
        } else if (type === 'foodTable') {
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX,
                y: snappedCenterY,
                width: 150,
                height: 80,
                rotation: 0,
                name: 'Food Table',
            };
            newElements.push(newPrimaryElement);
        } else if (type === 'chair') {
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX,
                y: snappedCenterY,
                parentId: null,
                guestName: guestName || '',
            };
            newElements.push(newPrimaryElement);
        } else if (type === 'wall') {
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX,
                y: snappedCenterY,
                width: 150,
                height: 20,
                rotation: 0,
            };
            newElements.push(newPrimaryElement);
        }

        setElements((prevElements) => [...prevElements, ...newElements]);
        if (newPrimaryElement) {
            setSelectedElementId(newPrimaryElement.id);
        }
    };

    const handleMouseDown = useCallback((e, elementId) => {
        e.stopPropagation();

        setSelectedElementId(elementId);

        const draggedEl = elements.find(el => el.id === elementId);
        if (!draggedEl || !svgRef.current || !propertiesPanelRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const panelWidth = propertiesPanelRef.current.offsetWidth || 384;
        const panelHeight = propertiesPanelRef.current.offsetHeight || 400;

        const padding = 20;

        let newLeft = 'auto';
        let newRight = 'auto';
        let newTop = padding;
        let newBottom = 'auto';

        const elementCenterX = draggedEl.x;
        const roomHalfWidth = roomWidth / 2;

        if (elementCenterX < roomHalfWidth) {
            newRight = padding;
            newLeft = 'auto';
        } else {
            newLeft = padding;
            newRight = 'auto';
        }

        const availableHeight = window.innerHeight - 2 * padding;
        const centerOffset = (availableHeight - panelHeight) / 2;
        newTop = Math.max(padding, Math.min(window.innerHeight - panelHeight - padding, padding + centerOffset));

        setPanelPosition({
            position: 'fixed',
            top: newTop,
            left: newLeft,
            right: newRight,
            bottom: newBottom,
            opacity: 1,
            zIndex: 50
        });

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        setDraggedElementId(elementId);
        setDragOffset({
            x: clientX - svgRect.left - draggedEl.x,
            y: clientY - svgRect.top - draggedEl.y,
        });
    }, [elements, roomWidth, roomHeight]);

    const handleMouseMove = useCallback((e) => {
        if (!draggedElementId || dragOffset === null) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const currentMouseXRelativeToSvg = clientX - svgRect.left;
        const currentMouseYRelativeToSvg = clientY - svgRect.top;

        const desiredElementX = currentMouseXRelativeToSvg - dragOffset.x;
        const desiredElementY = currentMouseYRelativeToSvg - dragOffset.y;

        const snappedNewX = snapToGrid(desiredElementX);
        const snappedNewY = snapToGrid(desiredElementY);

        setElements((prevElements) => {
            const updatedElements = prevElements.map((el) => {
                if (el.id === draggedElementId) {
                    return { ...el, x: snappedNewX, y: snappedNewY };
                } else if (el.type === 'chair' && el.parentId === draggedElementId) {
                    const parentTable = prevElements.find(p => p.id === draggedElementId);
                    if (!parentTable) return el;

                    const deltaX = snappedNewX - parentTable.x;
                    const deltaY = snappedNewY - parentTable.y;

                    return { ...el, x: snapToGrid(el.x + deltaX), y: snapToGrid(el.y + deltaY) };
                }
                return el;
            });
            return updatedElements;
        });
    }, [draggedElementId, dragOffset, snapToGrid]);

    const handleMouseUp = useCallback(() => {
        setDraggedElementId(null);
        setDragOffset({ x: 0, y: 0 });
    }, []);

    const handleSvgClick = useCallback((e) => {
        if (e.target === svgRef.current) {
            setSelectedElementId(null);
            setPanelPosition({ top: 'auto', left: 'auto', right: 'auto', bottom: 20, opacity: 0 });
        }
    }, []);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('mousemove', handleMouseMove);
            svgElement.addEventListener('mouseup', handleMouseUp);
            svgElement.addEventListener('touchmove', handleMouseMove);
            svgElement.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mousemove', handleMouseMove);
                svgElement.removeEventListener('mouseup', handleMouseUp);
                svgElement.removeEventListener('touchmove', handleMouseMove);
                svgElement.removeEventListener('touchend', handleMouseUp);
            }
        };
    }, [handleMouseMove, handleMouseUp]);

    const handlePropertyChange = useCallback((e) => {
        const { name, value, type } = e.target;
        setElements((prevElements) =>
            prevElements.map((el) => {
                if (el.id === selectedElementId) {
                    if (el.type === 'chair' && name === 'guestName') {
                        return { ...el, guestName: value };
                    }
                    if (el.type === 'table' && name === 'tableNumber') {
                        return { ...el, tableNumber: value };
                    }
                    if (el.type === 'foodTable' && name === 'name') {
                        return { ...el, name: value };
                    }

                    if (type === 'number') {
                        const parsed = parseFloat(value);
                        return {
                            ...el,
                            [name]: isNaN(parsed) ? (value === '' ? '' : 0) : parsed,
                        };
                    }
                    return {
                        ...el,
                        [name]: value,
                    };
                }
                return el;
            })
        );
    }, [selectedElementId]);

    const handleDeleteElement = useCallback(() => {
        setElements((prevElements) => {
            const elementToDelete = prevElements.find(el => el.id === selectedElementId);
            if (!elementToDelete) return prevElements;

            if (elementToDelete.type === 'table') {
                return prevElements.filter(el =>
                    el.id !== selectedElementId && el.parentId !== selectedElementId
                );
            } else {
                return prevElements.filter((el) => el.id !== selectedElementId);
            }
        });
        setSelectedElementId(null);
        setPanelPosition({ top: 'auto', left: 'auto', right: 'auto', bottom: 20, opacity: 0 });
    }, [selectedElementId]);

    const handleRotateElement = useCallback(() => {
        setElements(prevElements => {
            const selectedEl = prevElements.find(el => el.id === selectedElementId);
            if (!selectedEl || (selectedEl.type !== 'table' && selectedEl.type !== 'wall' && selectedEl.type !== 'foodTable')) {
                return prevElements;
            }

            const newRotation = (selectedEl.rotation + 15) % 360;
            const deltaRotationRadians = ((newRotation - selectedEl.rotation + 360) % 360) * Math.PI / 180;

            return prevElements.map(el => {
                if (el.id === selectedElementId) {
                    return { ...el, rotation: newRotation };
                } else if (el.type === 'chair' && el.parentId === selectedElementId) {
                    const tableCenterX = selectedEl.x;
                    const tableCenterY = selectedEl.y;

                    const translatedX = el.x - tableCenterX;
                    const translatedY = el.y - tableCenterY;

                    const rotatedX = translatedX * Math.cos(deltaRotationRadians) - translatedY * Math.sin(deltaRotationRadians);
                    const rotatedY = translatedX * Math.sin(deltaRotationRadians) + translatedY * Math.cos(deltaRotationRadians);

                    const newChairX = snapToGrid(tableCenterX + rotatedX);
                    const newChairY = snapToGrid(tableCenterY + rotatedY);

                    return { ...el, x: newChairX, y: newChairY };
                }
                return el;
            });
        });
    }, [selectedElementId, snapToGrid]);

    // New function to copy the selected element
    const handleCopyElement = useCallback(() => {
        if (!selectedElement) {
            setMessageModalContent("Please select an element to copy.");
            setShowMessageModal(true);
            return;
        }

        const copiedElements = [];
        const copyOffset = gridSize; // Offset for new copied element

        // Create a copy of the selected element
        const newSelectedElement = {
            ...selectedElement,
            id: `${selectedElement.type}-${Date.now()}-copy`, // Generate new unique ID
            x: snapToGrid(selectedElement.x + copyOffset), // Offset X
            y: snapToGrid(selectedElement.y + copyOffset), // Offset Y
        };
        copiedElements.push(newSelectedElement);

        // If the selected element is a table, copy its associated chairs as well
        if (selectedElement.type === 'table') {
            const originalTableId = selectedElement.id;
            const newTableId = newSelectedElement.id;

            elements.forEach(el => {
                if (el.type === 'chair' && el.parentId === originalTableId) {
                    copiedElements.push({
                        ...el,
                        id: `chair-${Date.now()}-copy-${Math.random()}`, // Unique ID for copied chair
                        parentId: newTableId, // Link to the new table
                        x: snapToGrid(el.x + copyOffset), // Offset X
                        y: snapToGrid(el.y + copyOffset), // Offset Y
                    });
                }
            });
        }

        setElements(prevElements => [...prevElements, ...copiedElements]);
        setSelectedElementId(newSelectedElement.id); // Select the newly copied element
        setMessageModalContent("Element copied successfully!");
        setShowMessageModal(true);
    }, [selectedElement, elements, snapToGrid]);


    const handleRoomDimensionChange = useCallback((e) => {
        const { name, value } = e.target;
        const numValue = Math.max(100, parseFloat(value));
        if (name === 'roomWidth') {
            setRoomWidth(numValue);
        } else if (name === 'roomHeight') {
            setRoomHeight(numValue);
        }
    }, []);

    const handleAddGuestClick = useCallback(() => {
        if (selectedElement && selectedElement.type === 'chair') {
            setGuestNameInput(selectedElement.guestName || '');
            setGuestModalContext('edit');
            setShowGuestNameModal(true);
        } else {
            setMessageModalContent("Please select a chair first to assign a guest name.");
            setShowMessageModal(true);
        }
    }, [selectedElement]);

    const handleGuestNameSubmit = useCallback(() => {
        if (guestNameInput.trim()) {
            if (guestModalContext === 'edit' && selectedElementId) {
                setElements(prevElements => prevElements.map(el =>
                    el.id === selectedElementId ? { ...el, guestName: guestNameInput.trim() } : el
                ));
            } else if (guestModalContext === 'add') {
                addElement('chair', null, guestNameInput.trim());
            }
        }
        setGuestNameInput('');
        setShowGuestNameModal(false);
        setGuestModalContext(null);
    }, [guestNameInput, guestModalContext, selectedElementId]);

    const handleDownloadGuestList = useCallback(() => {
        const guestList = {};
        const tables = elements.filter(el => el.type === 'table');

        const tableNumberMap = tables.reduce((acc, table) => {
            acc[table.id] = table.tableNumber || 'Unassigned Table';
            return acc;
        }, {});

        elements.forEach(el => {
            if (el.type === 'chair' && el.guestName) {
                const tableNum = tableNumberMap[el.parentId] || 'Standalone Chairs';
                if (!guestList[tableNum]) {
                    guestList[tableNum] = [];
                }
                guestList[tableNum].push(el.guestName);
            }
        });

        let textContent = "Wedding Guest List\n\n";

        const sortedTableNumbers = Object.keys(guestList).sort((a, b) => {
            if (a === 'Unassigned Table') return 1;
            if (b === 'Unassigned Table') return -1;
            if (a === 'Standalone Chairs') return 1;
            if (b === 'Standalone Chairs') return -1;
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        });

        sortedTableNumbers.forEach(tableNum => {
            textContent += `--- ${tableNum} ---\n`;
            guestList[tableNum].sort().forEach(guest => {
                textContent += `- ${guest}\n`;
            });
            textContent += "\n";
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wedding_guest_list.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [elements]);

    // Function to download the entire project as a JSON file
    const handleDownloadProject = useCallback(() => {
        const projectData = {
            elements: elements,
            roomWidth: roomWidth,
            roomHeight: roomHeight,
            // Add any other state variables you want to save
        };
        const jsonString = JSON.stringify(projectData, null, 2); // Pretty print JSON

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wedding_seating_project.json'; // Suggested filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessageModalContent("Project downloaded successfully!");
        setShowMessageModal(true);
    }, [elements, roomWidth, roomHeight]);

    // Function to handle uploading a project file
    const handleUploadProject = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                if (loadedData.elements && Array.isArray(loadedData.elements)) {
                    setElements(loadedData.elements);
                    setRoomWidth(loadedData.roomWidth || 800);
                    setRoomHeight(loadedData.roomHeight || 600);
                    setSelectedElementId(null); // Clear selection after loading
                    setMessageModalContent("Project uploaded successfully!");
                    setShowMessageModal(true);
                } else {
                    setMessageModalContent("Invalid project file format. Please upload a valid JSON project file.");
                    setShowMessageModal(true);
                }
            } catch (error) {
                console.error("Error parsing uploaded file:", error);
                setMessageModalContent(`Error loading project file: ${error.message}. Please ensure it's a valid JSON.`);
                setShowMessageModal(true);
            }
        };
        reader.readAsText(file);
        // Clear the file input value so that the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Component to render a single Table
    const Table = ({ table, onMouseDown, isSelected }) => {
        const { id, x, y, shape, width, height, rotation, tableNumber } = table;
        const isRound = shape === 'round';

        const strokeColor = isSelected ? '#3B82F6' : '#4B5563';
        const strokeWidth = isSelected ? '4' : '2';

        const transform = `rotate(${Number(rotation || 0)}, ${Number(x)}, ${Number(y)})`;

        return (
            <g
                onMouseDown={(e) => onMouseDown(e, id)}
                onTouchStart={(e) => onMouseDown(e, id)}
                style={{ cursor: 'grab' }}
                transform={transform}
            >
                {isRound ? (
                    <circle
                        cx={Number(x)}
                        cy={Number(y)}
                        r={Number(width / 2)}
                        fill="#9CA3AF"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        rx="10" ry="10"
                    />
                ) : (
                    <rect
                        x={Number(x - width / 2)}
                        y={Number(y - height / 2)}
                        width={Number(width)}
                        height={Number(height)}
                        fill="#9CA3AF"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        rx="10" ry="10"
                    />
                )}
                <text x={Number(x)} y={Number(y - 10)} textAnchor="middle" alignmentBaseline="middle" fill="#1F2937" fontSize="12" fontWeight="bold">
                    {tableNumber ? `Table ${tableNumber}` : 'Guest Table'}
                </text>
            </g>
        );
    };

    // Component to render a single Chair
    const Chair = ({ chair, onMouseDown, isSelected }) => {
        const { id, x, y, guestName } = chair;
        const strokeColor = isSelected ? '#3B82F6' : '#6B7280';
        const strokeWidth = isSelected ? '2' : '1';
        const chairLineLength = 15;
        const hitBoxSize = 30;

        return (
            <g>
                <rect
                    x={Number(x - hitBoxSize / 2)}
                    y={Number(y - hitBoxSize / 2)}
                    width={Number(hitBoxSize)}
                    height={Number(hitBoxSize)}
                    fill="transparent"
                    cursor="grab"
                    onMouseDown={(e) => onMouseDown(e, id)}
                    onTouchStart={(e) => onMouseDown(e, id)}
                />
                <line
                    x1={Number(x - chairLineLength / 2)} y1={Number(y)}
                    x2={Number(x + chairLineLength / 2)} y2={Number(y)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {guestName && (
                    <text
                        x={Number(x)}
                        y={Number(y - 5)}
                        fill="#374151"
                        fontSize="12"
                        textAnchor="middle"
                        alignmentBaseline="alphabetic"
                        fontWeight="bold"
                        pointerEvents="none"
                    >
                        {guestName}
                    </text>
                )}
            </g>
        );
    };

    const FoodTable = ({ foodTable, onMouseDown, isSelected }) => {
        const { id, x, y, width, height, rotation, name } = foodTable;
        const strokeColor = isSelected ? '#3B82F6' : '#EF4444';
        const strokeWidth = isSelected ? '4' : '2';

        const transform = `rotate(${Number(rotation || 0)}, ${Number(x)}, ${Number(y)})`;

        return (
            <g
                onMouseDown={(e) => onMouseDown(e, id)}
                onTouchStart={(e) => onMouseDown(e, id)}
                style={{ cursor: 'grab' }}
                transform={transform}
            >
                <rect
                    x={Number(x - width / 2)}
                    y={Number(y - height / 2)}
                    width={Number(width)}
                    height={Number(height)}
                    fill="#FECACA"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    rx="10" ry="10"
                />
                <text x={Number(x)} y={Number(y)} textAnchor="middle" alignmentBaseline="middle" fill="#B91C1C" fontSize="14" fontWeight="bold">
                    {name || 'Food Table'}
                </text>
            </g>
        );
    };

    const Wall = ({ wall, onMouseDown, isSelected }) => {
        const { id, x, y, width, height, rotation } = wall;
        const strokeColor = isSelected ? '#3B82F6' : '#6B7280';
        const fillColor = '#A1A1AA';
        const strokeWidth = isSelected ? '3' : '1';

        const transform = `rotate(${Number(rotation || 0)}, ${Number(x)}, ${Number(y)})`;

        return (
            <g
                onMouseDown={(e) => onMouseDown(e, id)}
                onTouchStart={(e) => onMouseDown(e, id)}
                style={{ cursor: 'grab' }}
                transform={transform}
            >
                <rect
                    x={Number(x - width / 2)}
                    y={Number(y - height / 2)}
                    width={Number(width)}
                    height={Number(height)}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    rx="2" ry="2"
                />
                <text x={Number(x)} y={Number(y + 5)} textAnchor="middle" alignmentBaseline="middle" fill="#374151" fontSize="10" fontWeight="bold">
                    Wall
                </text>
            </g>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 font-inter text-gray-800 flex flex-col items-center">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .cursor-grab {
                    cursor: grab;
                }
                .cursor-grabbing {
                    cursor: grabbing;
                }
                /* Modal styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 90%;
                    max-width: 400px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-weight: 600;
                    color: #4B5563;
                }
                .input-group input, .input-group select {
                    padding: 10px;
                    border: 1px solid #D1D5DB;
                    border-radius: 8px;
                    font-size: 16px;
                }
                `}
            </style>

            <h1 className="text-4xl font-bold text-purple-700 mb-6 drop-shadow-lg">Wedding Seating Chart</h1>

            {/* User ID and Save Status - Removed as cloud save is removed */}
            {/* <div className="text-sm text-gray-600 mb-2">
                {userId ? `User ID: ${userId}` : 'Authenticating...'}
                {saveStatus && <span className="ml-4 font-semibold text-blue-700">{saveStatus}</span>}
            </div> */}
            {/* Loading Indicator - Removed as cloud save is removed */}
            {/* {loading && (
                <div className="flex items-center justify-center mb-4 text-blue-600">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Project...
                </div>
            )} */}

            {/* Controls for adding elements and room dimensions */}
            <div className="bg-white p-2 rounded-xl shadow-lg flex flex-wrap gap-2 mb-4 justify-center w-full max-w-5xl">
                <div className="input-group flex-1 min-w-[120px] max-w-[150px]">
                    <label htmlFor="roomWidth" className="text-xs">Room Width (px):</label>
                    <input
                        type="number"
                        id="roomWidth"
                        name="roomWidth"
                        value={roomWidth}
                        onChange={handleRoomDimensionChange}
                        min="100"
                        className="border border-gray-300 p-1 rounded-md text-sm w-full"
                    />
                </div>
                <div className="input-group flex-1 min-w-[120px] max-w-[150px]">
                    <label htmlFor="roomHeight" className="text-xs">Room Height (px):</label>
                    <input
                        type="number"
                        id="roomHeight"
                        name="roomHeight"
                        value={roomHeight}
                        onChange={handleRoomDimensionChange}
                        min="100"
                        className="border border-gray-300 p-1 rounded-md text-sm w-full"
                    />
                </div>

                <button
                    onClick={() => addElement('table', 'round')}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                    Add Round Table
                </button>
                <button
                    onClick={() => addElement('table', 'rectangle')}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                    Add Rectangle Table
                </button>
                <button
                    onClick={handleAddGuestClick}
                    className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                    Assign Guest to Chair
                </button>
                <button
                    onClick={() => addElement('foodTable')}
                    className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                >
                    Add Food Table
                </button>
                <button
                    onClick={() => addElement('chair')}
                    className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                >
                    Add Chair
                </button>
                <button
                    onClick={() => addElement('wall')}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    Add Wall
                </button>
                {/* Removed Save to Cloud Button */}
                {/* <button
                    onClick={saveProject}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    Save to Cloud
                </button> */}
                <button
                    onClick={handleDownloadProject}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                >
                    Download Project File
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadProject}
                    className="hidden"
                    accept=".json"
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
                >
                    Upload Project File
                </button>
                <button
                    onClick={handleDownloadGuestList}
                    className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
                >
                    Download Guest List
                </button>
                <button
                    onClick={() => {
                        setElements([]);
                        setSelectedElementId(null);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                    Clear All
                </button>
            </div>

            {/* Guest Name Input Modal */}
            {showGuestNameModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-xl font-semibold text-gray-800">Assign Guest Name</h3>
                        <div className="input-group">
                            <label htmlFor="guestName">Name:</label>
                            <input
                                type="text"
                                id="guestName"
                                value={guestNameInput}
                                onChange={(e) => setGuestNameInput(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleGuestNameSubmit();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setGuestNameInput('');
                                    setShowGuestNameModal(false);
                                    setGuestModalContext(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGuestNameSubmit}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Assign Name
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="text-gray-800">{messageModalContent}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seating Chart Canvas */}
            <div className="w-full bg-white rounded-xl shadow-xl border-4 border-dashed border-gray-300 overflow-hidden relative" style={{ height: '70vh' }}>
                <svg
                    ref={svgRef}
                    width={roomWidth}
                    height={roomHeight}
                    viewBox={`0 0 ${roomWidth} ${roomHeight}`}
                    className={`block ${draggedElementId ? 'cursor-grabbing' : 'cursor-default'}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onClick={handleSvgClick}
                >
                    {/* Grid Lines (Optional - for visual reference) */}
                    {Array.from({ length: roomWidth / gridSize }).map((_, i) => (
                        <line
                            key={`v-grid-${i}`}
                            x1={Number(i * gridSize)}
                            y1="0"
                            x2={Number(i * gridSize)}
                            y2={Number(roomHeight)}
                            stroke="#E5E7EB"
                            strokeWidth="0.5"
                        />
                    ))}
                    {Array.from({ length: roomHeight / gridSize }).map((_, i) => (
                        <line
                            key={`h-grid-${i}`}
                            x1="0"
                            y1={Number(i * gridSize)}
                            x2={Number(roomWidth)}
                            y2={Number(i * gridSize)}
                            stroke="#E5E7EB"
                            strokeWidth="0.5"
                        />
                    ))}

                    {elements.map((element) => {
                        const isSelected = selectedElementId === element.id;
                        if (element.type === 'table') {
                            return <Table key={element.id} table={element} onMouseDown={handleMouseDown} isSelected={isSelected} />;
                        } else if (element.type === 'foodTable') {
                            return <FoodTable key={element.id} foodTable={element} onMouseDown={handleMouseDown} isSelected={isSelected} />;
                        } else if (element.type === 'chair') {
                            return <Chair key={element.id} chair={element} onMouseDown={handleMouseDown} isSelected={isSelected} />;
                        } else if (element.type === 'wall') {
                            return <Wall key={element.id} wall={element} onMouseDown={handleMouseDown} isSelected={isSelected} />;
                        }
                        return null;
                    })}
                </svg>
            </div>

            <p className="mt-4 text-gray-600 text-sm">Click on an element to select it, then drag to move. Click on the background to deselect.</p>

            {/* Properties Panel for Selected Element */}
            {selectedElement && (
                <div
                    ref={propertiesPanelRef}
                    data-selected-id={selectedElementId}
                    style={{
                        position: panelPosition.position,
                        top: panelPosition.top,
                        left: panelPosition.left,
                        right: panelPosition.right,
                        bottom: panelPosition.bottom,
                        opacity: panelPosition.opacity,
                        zIndex: panelPosition.zIndex,
                        transition: 'top 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out, opacity 0.2s ease-out',
                    }}
                    className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-blue-200 flex flex-col gap-4"
                >
                    <h3 className="text-2xl font-semibold text-gray-800">Properties: <span className="font-bold text-blue-600">
                        {selectedElement.type === 'table' ? 'Guest Table' :
                         selectedElement.type === 'foodTable' ? 'Food Table' :
                         selectedElement.type === 'chair' ? 'Chair' :
                         selectedElement.type === 'wall' ? 'Wall' :
                         'Selected Element'
                        }
                    </span></h3>

                    {selectedElement.type === 'table' && (
                        <>
                            <div className="flex gap-4">
                                <div className="input-group flex-1">
                                    <label htmlFor="tableWidth">Width:</label>
                                    <input
                                        type="number"
                                        id="tableWidth"
                                        name="width"
                                        value={selectedElement.width}
                                        onChange={handlePropertyChange}
                                        min="10"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div className="input-group flex-1">
                                    <label htmlFor="tableHeight">Height:</label>
                                    <input
                                        type="number"
                                        id="tableHeight"
                                        name="height"
                                        value={selectedElement.height}
                                        onChange={handlePropertyChange}
                                        min="10"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="tableNumber">Table Number:</label>
                                <input
                                    type="text"
                                    id="tableNumber"
                                    name="tableNumber"
                                    value={selectedElement.tableNumber}
                                    onChange={handlePropertyChange}
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                    placeholder="e.g., 1, A, Main"
                                />
                            </div>
                            <button
                                onClick={handleRotateElement}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 mt-2"
                            >
                                Rotate Table (15°)
                            </button>
                        </>
                    )}

                    {selectedElement.type === 'foodTable' && (
                        <>
                            <div className="flex gap-4">
                                <div className="input-group flex-1">
                                    <label htmlFor="foodTableName">Name:</label>
                                    <input
                                        type="text"
                                        id="foodTableName"
                                        name="name"
                                        value={selectedElement.name || ''}
                                        onChange={handlePropertyChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                        placeholder="e.g., Buffet, Cake Table"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="input-group flex-1">
                                    <label htmlFor="foodTableWidth">Width:</label>
                                    <input
                                        type="number"
                                        id="foodTableWidth"
                                        name="width"
                                        value={selectedElement.width}
                                        onChange={handlePropertyChange}
                                        min="10"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div className="input-group flex-1">
                                    <label htmlFor="foodTableHeight">Height:</label>
                                    <input
                                        type="number"
                                        id="foodTableHeight"
                                        name="height"
                                        value={selectedElement.height}
                                        onChange={handlePropertyChange}
                                        min="10"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleRotateElement}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 mt-2"
                            >
                                Rotate Food Table (15°)
                            </button>
                        </>
                    )}

                    {selectedElement.type === 'chair' && (
                        <div className="input-group">
                            <label htmlFor="chairGuestName">Guest Name:</label>
                            <input
                                type="text"
                                id="chairGuestName"
                                name="guestName"
                                value={selectedElement.guestName}
                                onChange={handlePropertyChange}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                            />
                        </div>
                    )}

                    {selectedElement.type === 'wall' && (
                        <>
                            <div className="flex gap-4">
                                <div className="input-group flex-1">
                                    <label htmlFor="wallWidth">Width:</label>
                                    <input
                                        type="number"
                                        id="wallWidth"
                                        name="width"
                                        value={selectedElement.width}
                                        onChange={handlePropertyChange}
                                        min="10"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div className="input-group flex-1">
                                    <label htmlFor="wallHeight">Height:</label>
                                    <input
                                        type="number"
                                        id="wallHeight"
                                        name="height"
                                        value={selectedElement.height}
                                        onChange={handlePropertyChange}
                                        min="1"
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleRotateElement}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 mt-2"
                            >
                                Rotate Wall (15°)
                            </button>
                        </>
                    )}

                    <button
                        onClick={handleCopyElement}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-4"
                    >
                        Copy Selected Element
                    </button>
                    <button
                        onClick={handleDeleteElement}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 mt-4"
                    >
                        Delete Selected Element
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
