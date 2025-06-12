import React, { useState, useRef, useEffect, useCallback } from 'react';

// Main App component
const App = () => {
    // State to hold all elements on the seating chart
    const [elements, setElements] = useState([]);
    // State to track the currently dragged element ID
    const [draggedElementId, setDraggedElementId] = useState(null);
    // State to store the initial mouse offset from the dragged element's origin
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Renamed from startMousePos for clarity
    // Ref for the SVG canvas to get its position
    const svgRef = useRef(null);
    // Ref for the properties panel to get its dimensions
    const propertiesPanelRef = useRef(null);

    // State to track the currently selected element for property editing
    const [selectedElementId, setSelectedElementId] = useState(null);
    // State for dynamic positioning of the properties panel
    const [panelPosition, setPanelPosition] = useState({ top: 'auto', left: 'auto', right: 'auto', bottom: 20, opacity: 0 });


    // State for the guest name input modal
    const [showGuestNameModal, setShowGuestNameModal] = useState(false);
    const [guestNameInput, setGuestNameInput] = useState('');
    const [guestModalContext, setGuestModalContext] = useState(null); // 'add' or 'edit'

    // State for the generic message modal (e.g., "Please select a chair")
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState('');


    // New state for room dimensions
    const [roomWidth, setRoomWidth] = useState(800); // Default room width
    const [roomHeight, setRoomHeight] = useState(600); // Default room height

    // New state for grid size
    const gridSize = 25; // Define the snap-to-grid size

    // Get the currently selected element object
    const selectedElement = elements.find((el) => el.id === selectedElementId);

    // Helper function to snap a coordinate to the grid
    const snapToGrid = (coord) => {
        return Math.round(coord / gridSize) * gridSize;
    };

    // Function to add a new element to the chart
    const addElement = (type, shape = 'round', guestName = '') => {
        let newPrimaryElement;
        const newElements = [];

        // Adjust initial position to be centered within the current view
        // This makes new elements appear in the visible area more reliably
        const currentSvgRect = svgRef.current?.getBoundingClientRect();
        // Use fallbacks for centerX/Y in case svgRef.current is null initially
        const centerX = currentSvgRect ? currentSvgRect.width / 2 : roomWidth / 2;
        const centerY = currentSvgRect ? currentSvgRect.height / 2 : roomHeight / 2;


        // Snap initial position to grid
        const snappedCenterX = snapToGrid(centerX);
        const snappedCenterY = snapToGrid(centerY);

        if (type === 'table') {
            const tableId = `table-${Date.now()}`;
            let defaultWidth, defaultHeight;

            if (shape === 'round') {
                defaultWidth = 100;
                defaultHeight = 100;
            } else { // shape === 'rectangle'
                defaultWidth = 50; // Rectangular width: 50
                defaultHeight = 100; // Rectangular height: 100
            }

            newPrimaryElement = {
                id: tableId,
                type: type,
                x: snappedCenterX, // Place new table in center, snapped to grid
                y: snappedCenterY, // Place new table in center, snapped to grid
                shape: shape,
                width: defaultWidth,
                height: defaultHeight,
                rotation: 0, // Default to 0 degrees
            };
            newElements.push(newPrimaryElement);

            // Add initial chairs based on table shape
            const chairDistance = 20; // Adjusted chair distance from table edge
            const chairLineLength = 15; // Length of the chair line placeholder

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
                        x: snapToGrid(chairX), // Snap chair position
                        y: snapToGrid(chairY), // Snap chair position
                        parentId: tableId, // Link chair to the table
                        guestName: '', // New: Guest name property for chair
                    });
                }
            } else { // shape === 'rectangle'
                const chairsPerSide = 4;
                const halfWidth = defaultWidth / 2;
                const halfHeight = defaultHeight / 2;

                // Place chairs on the longer sides (which are now vertical sides by default)
                // Chairs along the height (longer) sides
                for (let i = 0; i < chairsPerSide; i++) {
                    const yOffset = -halfHeight + (i + 0.5) * (defaultHeight / chairsPerSide); // Distribute along height evenly
                    newElements.push({
                        id: `chair-${Date.now()}-left-${i}`,
                        type: 'chair',
                        x: snapToGrid(snappedCenterX - halfWidth - chairDistance), // Snap chair position
                        y: snapToGrid(snappedCenterY + yOffset), // Snap chair position
                        parentId: tableId,
                        guestName: '',
                    });
                    newElements.push({
                        id: `chair-${Date.now()}-right-${i}`,
                        type: 'chair',
                        x: snapToGrid(snappedCenterX + halfWidth + chairDistance), // Snap chair position
                        y: snapToGrid(snappedCenterY + yOffset), // Snap chair position
                        parentId: tableId,
                        guestName: '',
                    });
                }
            }
        } else if (type === 'foodTable') {
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX, // Place new food table in center, snapped
                y: snappedCenterY, // Place new food table in center, snapped
                width: 150,
                height: 80,
            };
            newElements.push(newPrimaryElement);
        } else if (type === 'chair') {
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX, // Place new standalone chair in center, snapped
                y: snappedCenterY, // Place new standalone chair in center, snapped
                parentId: null, // Standalone chair has no parent table
                guestName: guestName || '', // Guest name can be set on creation
            };
            newElements.push(newPrimaryElement);
        } else if (type === 'wall') { // New wall element type
            newPrimaryElement = {
                id: `${type}-${Date.now()}`,
                type: type,
                x: snappedCenterX, // snapped
                y: snappedCenterY, // snapped
                width: 150,
                height: 20, // Default thin wall
                rotation: 0,
            };
            newElements.push(newPrimaryElement);
        }


        setElements((prevElements) => [...prevElements, ...newElements]);
        // Select the primary new element if it exists
        if (newPrimaryElement) {
            setSelectedElementId(newPrimaryElement.id);
        }
    };

    // Callback for when dragging starts or an element is selected
    const handleMouseDown = useCallback((e, elementId) => {
        e.stopPropagation(); // Prevent SVG pan/zoom if applicable (not implemented here but good practice)

        setSelectedElementId(elementId); // Set the selected element ID

        const svgRect = svgRef.current.getBoundingClientRect(); // Get SVG's position on screen
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        setDraggedElementId(elementId);

        const draggedEl = elements.find(el => el.id === elementId);
        if (!draggedEl) return; // Should not happen if elementId is valid

        // Store the offset of the mouse click from the element's origin (x,y)
        // This offset is maintained throughout the drag.
        setDragOffset({
            x: clientX - svgRect.left - draggedEl.x,
            y: clientY - svgRect.top - draggedEl.y,
        });
    }, [elements]); // Dependency on elements is crucial for `draggedEl` lookup

    // Callback for when mouse/touch moves
    const handleMouseMove = useCallback((e) => {
        if (!draggedElementId || dragOffset === null) return; // Use dragOffset instead of startMousePos

        const svgRect = svgRef.current.getBoundingClientRect();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const currentMouseXRelativeToSvg = clientX - svgRect.left;
        const currentMouseYRelativeToSvg = clientY - svgRect.top;

        // Calculate the desired (raw) new position of the element's origin,
        // by subtracting the stored offset from the current mouse position.
        const desiredElementX = currentMouseXRelativeToSvg - dragOffset.x;
        const desiredElementY = currentMouseYRelativeToSvg - dragOffset.y;

        // Snap the desired position to the grid
        const snappedNewX = snapToGrid(desiredElementX);
        const snappedNewY = snapToGrid(desiredElementY);

        setElements((prevElements) => {
            const updatedElements = prevElements.map((el) => {
                if (el.id === draggedElementId) {
                    // Return the dragged element with its new snapped position
                    return { ...el, x: snappedNewX, y: snappedNewY };
                } else if (el.type === 'chair' && el.parentId === draggedElementId) {
                    // If it's a child chair, calculate its new position relative to the table's movement
                    // This requires finding the table's *old* position from prevElements
                    const parentTable = prevElements.find(p => p.id === draggedElementId);
                    if (!parentTable) return el; // Should not happen if parentId is correct

                    // The change in parent's position
                    const deltaX = snappedNewX - parentTable.x;
                    const deltaY = snappedNewY - parentTable.y;

                    // Move chair by the same delta
                    return { ...el, x: snapToGrid(el.x + deltaX), y: snapToGrid(el.y + deltaY) };
                }
                return el;
            });
            return updatedElements;
        });
    }, [draggedElementId, dragOffset, snapToGrid]); // dragOffset is now a dependency

    // Callback for when dragging ends
    const handleMouseUp = useCallback(() => {
        setDraggedElementId(null); // Clear the dragged element
        setDragOffset({ x: 0, y: 0 }); // Reset offset
    }, []);

    // Handler for clicking on the SVG background to deselect
    const handleSvgClick = useCallback((e) => {
        // Only deselect if the click target is the SVG itself, not an element within it
        if (e.target === svgRef.current) {
            setSelectedElementId(null);
        }
    }, []);

    // Set up global event listeners for dragging
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
    }, [handleMouseMove, handleMouseUp]); // Re-attach if handlers change (though they are memoized)

    // Handler for updating properties of a selected element
    const handlePropertyChange = useCallback((e) => {
        const { name, value, type } = e.target;
        setElements((prevElements) =>
            prevElements.map((el) => {
                if (el.id === selectedElementId) {
                    // Handle guestName for chairs
                    if (el.type === 'chair' && name === 'guestName') {
                        return { ...el, guestName: value };
                    }

                    let updatedValue = value;
                    if (type === 'number') {
                        const parsedValue = parseFloat(value);
                        // Ensure a valid number, default to 10 for width/height if invalid or too small, else 0
                        if ((name === 'width' || name === 'height')) {
                             updatedValue = isNaN(parsedValue) || parsedValue < 1 ? 10 : parsedValue;
                        } else {
                            updatedValue = isNaN(parsedValue) ? 0 : parsedValue;
                        }
                    }
                    return {
                        ...el,
                        [name]: updatedValue,
                    };
                }
                return el;
            })
        );
    }, [selectedElementId]);

    // Handler for deleting a selected element (and its children if it's a table)
    const handleDeleteElement = useCallback(() => {
        setElements((prevElements) => {
            const elementToDelete = prevElements.find(el => el.id === selectedElementId);
            if (!elementToDelete) return prevElements;

            if (elementToDelete.type === 'table') {
                // Filter out the table itself and all chairs linked to it
                return prevElements.filter(el =>
                    el.id !== selectedElementId && el.parentId !== selectedElementId
                );
            } else {
                // For other types, just filter out the selected element
                return prevElements.filter((el) => el.id !== selectedElementId);
            }
        });
        setSelectedElementId(null); // Deselect after deleting
    }, [selectedElementId]);

    // Function to rotate the selected table or wall
    const handleRotateElement = useCallback(() => {
        setElements(prevElements => {
            const selectedEl = prevElements.find(el => el.id === selectedElementId);
            if (!selectedEl || (selectedEl.type !== 'table' && selectedEl.type !== 'wall')) {
                return prevElements; // Only rotate tables and walls
            }

            const newRotation = (selectedEl.rotation + 15) % 360;
            const deltaRotationRadians = ((newRotation - selectedEl.rotation + 360) % 360) * Math.PI / 180; // Ensure positive delta

            return prevElements.map(el => {
                if (el.id === selectedElementId) {
                    return { ...el, rotation: newRotation };
                } else if (el.type === 'chair' && el.parentId === selectedElementId) {
                    // Rotate linked chairs around the table's center
                    const tableCenterX = selectedEl.x;
                    const tableCenterY = selectedEl.y;

                    const translatedX = el.x - tableCenterX;
                    const translatedY = el.y - tableCenterY;

                    const rotatedX = translatedX * Math.cos(deltaRotationRadians) - translatedY * Math.sin(deltaRotationRadians);
                    const rotatedY = translatedX * Math.sin(deltaRotationRadians) + translatedY * Math.cos(deltaRotationRadians);

                    const newChairX = snapToGrid(tableCenterX + rotatedX); // Snap rotated chair
                    const newChairY = snapToGrid(tableCenterY + rotatedY); // Snap rotated chair

                    return { ...el, x: newChairX, y: newChairY };
                }
                return el;
            });
        });
    }, [selectedElementId, snapToGrid]);


    // Handler for room dimension changes
    const handleRoomDimensionChange = useCallback((e) => {
        const { name, value } = e.target;
        const numValue = Math.max(100, parseFloat(value)); // Ensure minimum size
        if (name === 'roomWidth') {
            setRoomWidth(numValue);
        } else if (name === 'roomHeight') {
            setRoomHeight(numValue);
        }
    }, []);

    // Guest name modal handlers
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
                // This path is less likely now, as 'Add Guest' focuses on editing existing chairs.
                // If we ever want to add a chair *and* name it directly via this modal, we'd enable this.
                // For now, it's primarily for editing selected chairs.
                addElement('chair', null, guestNameInput.trim());
            }
        }
        setGuestNameInput('');
        setShowGuestNameModal(false);
        setGuestModalContext(null);
    }, [guestNameInput, guestModalContext, selectedElementId]);

    // Component to render a single Table
    const Table = ({ table, onMouseDown, isSelected }) => {
        const { id, x, y, shape, width, height, rotation } = table; // Destructure rotation
        const isRound = shape === 'round';

        const strokeColor = isSelected ? '#3B82F6' : '#4B5563'; // Blue when selected, otherwise gray
        const strokeWidth = isSelected ? '4' : '2';

        // Apply rotation transform to the group
        const transform = `rotate(${Number(rotation || 0)}, ${Number(x)}, ${Number(y)})`; // Ensure numbers for rotation transform

        return (
            <g // Group element for table
                onMouseDown={(e) => onMouseDown(e, id)}
                onTouchStart={(e) => onMouseDown(e, id)}
                style={{ cursor: 'grab' }}
                transform={transform} // Apply the rotation here
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
                {/* Table label */}
                <text x={Number(x)} y={Number(y + (isRound ? 5 : 0))} textAnchor="middle" alignmentBaseline="middle" fill="#1F2937" fontSize="12" fontWeight="bold">
                    Guest Table
                </text>
            </g>
        );
    };

    // Component to render a single Chair
    const Chair = ({ chair, onMouseDown, isSelected }) => {
        const { id, x, y, guestName } = chair; // Destructure guestName
        const strokeColor = isSelected ? '#3B82F6' : '#6B7280'; // Blue when selected, otherwise gray
        const strokeWidth = isSelected ? '2' : '1';
        const chairLineLength = 15; // Length of the line representing the chair
        const hitBoxSize = 30; // Larger size for the invisible hitbox

        return (
            <g>
                {/* Invisible rectangle for larger clickable area */}
                <rect
                    x={Number(x - hitBoxSize / 2)}
                    y={Number(y - hitBoxSize / 2)}
                    width={Number(hitBoxSize)}
                    height={Number(hitBoxSize)}
                    fill="transparent" // Make it invisible
                    cursor="grab"
                    onMouseDown={(e) => onMouseDown(e, id)}
                    onTouchStart={(e) => onMouseDown(e, id)}
                />
                {/* Line representing the chair (visual, small) */}
                <line
                    x1={Number(x - chairLineLength / 2)} y1={Number(y)}
                    x2={Number(x + chairLineLength / 2)} y2={Number(y)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round" // Gives the line rounded ends
                />
                {/* Display guest name if available */}
                {guestName && (
                    <text
                        x={Number(x)}
                        y={Number(y + 15)} // Position below the line
                        fill="#374151" // Text color
                        fontSize="12" // Increased font size
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontWeight="bold" // Made text bold
                        pointerEvents="none" // Important: prevents text from capturing click, allowing hitbox to work
                    >
                        {guestName}
                    </text>
                )}
            </g>
        );
    };


    // Removed Guest component as it's no longer a standalone element type

    // Component to render a Food Table
    const FoodTable = ({ foodTable, onMouseDown, isSelected }) => {
        const { id, x, y, width, height } = foodTable;
        const strokeColor = isSelected ? '#3B82F6' : '#EF4444';
        const strokeWidth = isSelected ? '4' : '2';

        return (
            <g
                onMouseDown={(e) => onMouseDown(e, id)}
                onTouchStart={(e) => onMouseDown(e, id)}
                style={{ cursor: 'grab' }}
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
                    Food Table
                </text>
            </g>
        );
    };

    // Component to render a Wall
    const Wall = ({ wall, onMouseDown, isSelected }) => {
        const { id, x, y, width, height, rotation } = wall;
        const strokeColor = isSelected ? '#3B82F6' : '#6B7280'; // Blue when selected, otherwise gray
        const fillColor = '#A1A1AA'; // A dark gray for walls
        const strokeWidth = isSelected ? '3' : '1';

        // Apply rotation transform around the wall's center
        const transform = `rotate(${Number(rotation || 0)}, ${Number(x)}, ${Number(y)})`; // Ensure numbers for rotation transform

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
                    rx="2" ry="2" // Slightly rounded corners for walls
                />
                <text x={Number(x)} y={Number(y + 5)} textAnchor="middle" alignmentBaseline="middle" fill="#374151" fontSize="10" fontWeight="bold">
                    Wall
                </text>
            </g>
        );
    };

    // Effect to update panel position when selectedElement changes
    useEffect(() => {
        if (!selectedElement || !svgRef.current || !propertiesPanelRef.current) {
            // Hide or reset panel position when nothing is selected
            setPanelPosition({ top: 'auto', left: 'auto', right: 'auto', bottom: 20, opacity: 0 }); // Hide it
            return;
        }

        const svgRect = svgRef.current.getBoundingClientRect();
        const panelWidth = propertiesPanelRef.current.offsetWidth; // Use offsetWidth for actual rendered width
        const panelHeight = propertiesPanelRef.current.offsetHeight; // Use offsetHeight for actual rendered height

        const padding = 20; // Padding from screen edges
        const availableHeight = window.innerHeight - 2 * padding; // Max height for panel vertical placement

        let newLeft = 'auto';
        let newRight = 'auto';
        let newTop = padding; // Default to top padding
        let newBottom = 'auto';

        // Calculate if the selected element is on the left or right half of the SVG room
        // Use the element's center X relative to the SVG's internal coordinate system
        const elementCenterX = selectedElement.x;
        const roomHalfWidth = roomWidth / 2;

        if (elementCenterX < roomHalfWidth) {
            // Element is on the left half of the room, so place panel on the right side of the viewport
            newRight = padding;
            newLeft = 'auto'; // Ensure left is not set
        } else {
            // Element is on the right half of the room, so place panel on the left side of the viewport
            newLeft = padding;
            newRight = 'auto'; // Ensure right is not set
        }

        // Adjust vertical position to roughly center the panel in the available vertical space
        // or ensure it fits within the viewport.
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

    }, [selectedElement, roomWidth, roomHeight, window.innerWidth, window.innerHeight]); // Add window dimensions as dependencies for responsiveness


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 font-inter text-gray-800 flex flex-col items-center">
            {/* Tailwind CSS and Font */}
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

            {/* Controls for adding elements and room dimensions */}
            {/* Consolidated controls into one row, using flex-wrap for responsiveness */}
            <div className="bg-white p-2 rounded-xl shadow-lg flex flex-wrap gap-2 mb-4 justify-center w-full max-w-5xl">
                {/* Room Dimension Controls - now inline with other buttons */}
                <div className="input-group flex-1 min-w-[120px] max-w-[150px]"> {/* Adjusted width for smaller input */}
                    <label htmlFor="roomWidth" className="text-xs">Room Width (px):</label> {/* Smaller font for label */}
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
                <div className="input-group flex-1 min-w-[120px] max-w-[150px]"> {/* Adjusted width for smaller input */}
                    <label htmlFor="roomHeight" className="text-xs">Room Height (px):</label> {/* Smaller font for label */}
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

                {/* Main Action Buttons */}
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
                    ref={propertiesPanelRef} // Assign ref to the properties panel
                    style={{
                        position: panelPosition.position,
                        top: panelPosition.top,
                        left: panelPosition.left,
                        right: panelPosition.right,
                        bottom: panelPosition.bottom,
                        opacity: panelPosition.opacity,
                        zIndex: panelPosition.zIndex,
                        transition: 'top 0.2s ease-out, left 0.2s ease-out, opacity 0.2s ease-out', // Smooth transition
                    }}
                    className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-blue-200 flex flex-col gap-4" // Removed mt-6, fixed width for predictability
                >
                    <h3 className="text-2xl font-semibold text-gray-800">Properties: <span className="font-bold text-blue-600">
                        {selectedElement.type === 'table' ? 'Guest Table' :
                         selectedElement.type === 'foodTable' ? 'Food Table' :
                         selectedElement.type === 'chair' ? 'Chair' :
                         selectedElement.type === 'wall' ? 'Wall' :
                         'Selected Element' // Fallback for unknown type
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
                                        min="10" // Minimum size
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
                                        min="10" // Minimum size
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
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
                    )}

                    {selectedElement.type === 'chair' && (
                        <div className="input-group">
                            <label htmlFor="chairGuestName">Guest Name:</label>
                            <input
                                type="text"
                                id="chairGuestName"
                                name="guestName" // Use guestName for chair properties
                                value={selectedElement.guestName}
                                onChange={handlePropertyChange}
                                className="border border-gray-300 p-2 rounded-lg w-full"
                            />
                        </div>
                    )}

                    {selectedElement.type === 'wall' && ( // Properties for wall
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
                                        min="1" // Walls can be very thin
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleRotateElement} // Rotate walls
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 mt-2"
                            >
                                Rotate Wall (15°)
                            </button>
                        </>
                    )}

                    {/* Delete button always available for selected elements */}
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
