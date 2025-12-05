// Shopify Lighting Calculator JavaScript - Optimized Version
(function() {
    'use strict';
    
    // Main calculator initialization function
    function initLightingCalculator() {
        console.log('Initializing lighting calculator...');
        
        // Find ALL calculator containers (in case there are multiple)
        const calculatorContainers = document.querySelectorAll('.lighting-calculator-wrapper');
        
        if (calculatorContainers.length === 0) {
            console.warn('No lighting calculator containers found');
            return;
        }
        
        // Initialize each calculator instance
        calculatorContainers.forEach((container, index) => {
            console.log(`Setting up calculator #${index + 1}`);
            new LightingCalculator(container).init();
        });
    }
    
    // Lighting Calculator Class
    class LightingCalculator {
        constructor(container) {
            this.container = container;
            
            // Constants for unit conversion
            this.METERS_TO_FEET = 3.28084;
            this.FEET_TO_METERS = 0.3048;
            this.MM_TO_METERS = 0.001;
            this.DIALUX_MULTIPLIER = 1.097;
            
            // Simplified UF table with direct lookup
            this.ufTable = {
                0.6: { 0.5: {0.3: 0.49, 0.5: 0.54, 0.7: 0.61}, 0.7: {0.3: 0.50, 0.5: 0.55, 0.7: 0.63}, 0.8: {0.3: 0.50, 0.5: 0.55, 0.7: 0.64} },
                0.8: { 0.5: {0.3: 0.61, 0.5: 0.65, 0.7: 0.71}, 0.7: {0.3: 0.61, 0.5: 0.66, 0.7: 0.73}, 0.8: {0.3: 0.62, 0.5: 0.67, 0.7: 0.74} },
                1.0: { 0.5: {0.3: 0.68, 0.5: 0.72, 0.7: 0.77}, 0.7: {0.3: 0.69, 0.5: 0.73, 0.7: 0.79}, 0.8: {0.3: 0.69, 0.5: 0.74, 0.7: 0.80} },
                1.25:{ 0.5: {0.3: 0.74, 0.5: 0.77, 0.7: 0.81}, 0.7: {0.3: 0.75, 0.5: 0.79, 0.7: 0.84}, 0.8: {0.3: 0.76, 0.5: 0.80, 0.7: 0.85} },
                1.5: { 0.5: {0.3: 0.78, 0.5: 0.81, 0.7: 0.84}, 0.7: {0.3: 0.79, 0.5: 0.83, 0.7: 0.87}, 0.8: {0.3: 0.80, 0.5: 0.84, 0.7: 0.89} },
                2.0: { 0.5: {0.3: 0.81, 0.5: 0.84, 0.7: 0.87}, 0.7: {0.3: 0.83, 0.5: 0.86, 0.7: 0.90}, 0.8: {0.3: 0.84, 0.5: 0.87, 0.7: 0.91} },
                2.5: { 0.5: {0.3: 0.83, 0.5: 0.86, 0.7: 0.88}, 0.7: {0.3: 0.86, 0.5: 0.88, 0.7: 0.91}, 0.8: {0.3: 0.87, 0.5: 0.90, 0.7: 0.93} },
                3.0: { 0.5: {0.3: 0.85, 0.5: 0.87, 0.7: 0.89}, 0.7: {0.3: 0.87, 0.5: 0.90, 0.7: 0.92}, 0.8: {0.3: 0.88, 0.5: 0.91, 0.7: 0.94} },
                4.0: { 0.5: {0.3: 0.87, 0.5: 0.88, 0.7: 0.90}, 0.7: {0.3: 0.89, 0.5: 0.91, 0.7: 0.94}, 0.8: {0.3: 0.91, 0.5: 0.93, 0.7: 0.96} }
            };
            
            // Room Presets
            this.roomPresets = {
                small: { length: 3, width: 3, height: 2.4 },
                medium: { length: 5, width: 4, height: 2.7 },
                large: { length: 8, width: 6, height: 3 },
                office: { length: 6, width: 5, height: 2.8 },
                classroom: { length: 10, width: 8, height: 3.2 }
            };
            
            // Reflectance Presets
            this.reflectancePresets = {
                light: { ceiling: 0.8, wall: 0.7, floor: 0.2 },
                medium: { ceiling: 0.7, wall: 0.5, floor: 0.2 },
                dark: { ceiling: 0.5, wall: 0.3, floor: 0.2 }
            };
            
            // DOM elements will be stored here
            this.elements = {};
            this.initialized = false;
        }
        
        init() {
            if (this.initialized) {
                console.log('Calculator already initialized');
                return;
            }
            
            console.log('Initializing calculator instance');
            
            try {
                this.cacheElements();
                this.initializeForm();
                this.setupEventListeners();
                this.initialized = true;
                console.log('Calculator initialized successfully');
            } catch (error) {
                console.error('Error initializing calculator:', error);
            }
        }
        
        cacheElements() {
            console.log('Caching DOM elements...');
            
            // Cache all DOM elements we need
            // Use container.querySelector to scope to this specific calculator
            this.elements = {
                lengthInput: this.container.querySelector('#length'),
                widthInput: this.container.querySelector('#width'),
                heightInput: this.container.querySelector('#height'),
                mountingHeightInput: this.container.querySelector('#mountingHeight'),
                workingPlaneHeightInput: this.container.querySelector('#workingPlaneHeight'),
                targetLuxInput: this.container.querySelector('#targetLux'),
                numLuminairesInput: this.container.querySelector('#numLuminairesInput'),
                objectiveInput: this.container.querySelector('#objective'),
                roomTypeSelect: this.container.querySelector('#roomType'),
                lightSourceSelect: this.container.querySelector('#lightSource'),
                customLumensInput: this.container.querySelector('#customLumensInput'),
                ceilingReflectInput: this.container.querySelector('#ceilingReflect'),
                wallReflectInput: this.container.querySelector('#wallReflect'),
                floorReflectInput: this.container.querySelector('#floorReflect'),
                submitBtn: this.container.querySelector('#submitBtn'),
                submitSpinner: this.container.querySelector('#submitSpinner'),
                summaryDiv: this.container.querySelector('#summary'),
                summaryContent: this.container.querySelector('#summaryContent'),
                resultDiv: this.container.querySelector('#result'),
                layoutContainer: this.container.querySelector('#layoutContainer'),
                layoutVisualization: this.container.querySelector('#layoutVisualization'),
                layoutInfo: this.container.querySelector('#layoutInfo'),
                actionButtons: this.container.querySelector('#actionButtons'),
                copyBtn: this.container.querySelector('#copyBtn'),
                printBtn: this.container.querySelector('#printBtn'),
                targetLuxContainer: this.container.querySelector('#targetLuxContainer'),
                numLuminairesContainer: this.container.querySelector('#numLuminairesContainer'),
                spaceUnitLabel: this.container.querySelector('#spaceUnitLabel'),
                lightingForm: this.container.querySelector('#lightingForm')
            };
            
            // Debug: Log which elements were found
            Object.keys(this.elements).forEach(key => {
                if (this.elements[key]) {
                    console.log(`✓ Found element: ${key}`);
                } else {
                    console.warn(`✗ Missing element: ${key}`);
                }
            });
        }
        
        initializeForm() {
            console.log('Initializing form with default values...');
            
            // Set default values
            const defaults = {
                length: '5',
                width: '4',
                height: '3',
                mountingHeight: '2.5',
                workingPlaneHeight: '0.8',
                targetLux: '300',
                customLumens: '1000'
            };
            
            // Apply defaults if elements exist
            if (this.elements.lengthInput && !this.elements.lengthInput.value) this.elements.lengthInput.value = defaults.length;
            if (this.elements.widthInput && !this.elements.widthInput.value) this.elements.widthInput.value = defaults.width;
            if (this.elements.heightInput && !this.elements.heightInput.value) this.elements.heightInput.value = defaults.height;
            if (this.elements.mountingHeightInput && !this.elements.mountingHeightInput.value) this.elements.mountingHeightInput.value = defaults.mountingHeight;
            if (this.elements.workingPlaneHeightInput && !this.elements.workingPlaneHeightInput.value) this.elements.workingPlaneHeightInput.value = defaults.workingPlaneHeight;
            if (this.elements.targetLuxInput && !this.elements.targetLuxInput.value) this.elements.targetLuxInput.value = defaults.targetLux;
            if (this.elements.customLumensInput && !this.elements.customLumensInput.value) this.elements.customLumensInput.value = defaults.customLumens;
            
            // Initialize calculation mode
            this.toggleCalculationMode();
            
            // Setup validation
            this.setupRealTimeValidation();
            
            // Focus on first input
            if (this.elements.lengthInput) {
                setTimeout(() => {
                    this.elements.lengthInput.focus();
                }, 100);
            }
            
            console.log('Form initialized successfully');
        }
        
        setupEventListeners() {
            console.log('Setting up event listeners...');
            
            // Page navigation
            const navButtons = this.container.querySelectorAll('.nav-button');
            const pages = this.container.querySelectorAll('.page');
            
            if (navButtons.length > 0 && pages.length > 0) {
                navButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetPage = e.currentTarget.getAttribute('data-page');
                        
                        // Update active button
                        navButtons.forEach(btn => btn.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                        
                        // Show target page
                        pages.forEach(page => page.classList.remove('active'));
                        const targetPageElement = this.container.querySelector(`#${targetPage}-page`);
                        if (targetPageElement) {
                            targetPageElement.classList.add('active');
                        }
                    });
                });
                console.log('✓ Page navigation listeners added');
            }
            
            // Room preset buttons
            const roomPresetButtons = this.container.querySelectorAll('.preset-btn[data-preset]');
            if (roomPresetButtons.length > 0) {
                roomPresetButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const preset = e.currentTarget.getAttribute('data-preset');
                        const values = this.roomPresets[preset];
                        
                        if (values) {
                            if (this.elements.lengthInput) this.elements.lengthInput.value = values.length;
                            if (this.elements.widthInput) this.elements.widthInput.value = values.width;
                            if (this.elements.heightInput) this.elements.heightInput.value = values.height;
                            
                            // Auto-set mounting and working heights
                            if (this.elements.mountingHeightInput) this.elements.mountingHeightInput.value = (values.height - 0.2).toFixed(1);
                            if (this.elements.workingPlaneHeightInput) this.elements.workingPlaneHeightInput.value = '0.8';
                            
                            // Update active state
                            roomPresetButtons.forEach(b => b.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                        }
                    });
                });
                console.log('✓ Room preset listeners added');
            }
            
            // Reflectance preset buttons
            const reflectanceButtons = this.container.querySelectorAll('.preset-btn[data-reflectance]');
            if (reflectanceButtons.length > 0) {
                reflectanceButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const preset = e.currentTarget.getAttribute('data-reflectance');
                        const values = this.reflectancePresets[preset];
                        
                        if (values) {
                            if (this.elements.ceilingReflectInput) this.elements.ceilingReflectInput.value = values.ceiling;
                            if (this.elements.wallReflectInput) this.elements.wallReflectInput.value = values.wall;
                            if (this.elements.floorReflectInput) this.elements.floorReflectInput.value = values.floor;
                            
                            // Update active state
                            reflectanceButtons.forEach(b => b.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                        }
                    });
                });
                console.log('✓ Reflectance preset listeners added');
            }
            
            // Auto-calculate buttons
            const autoCalcButtons = this.container.querySelectorAll('.auto-calc-btn');
            if (autoCalcButtons.length > 0) {
                autoCalcButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const field = e.currentTarget.parentElement.querySelector('input');
                        if (field) {
                            if (field.id === 'mountingHeight') {
                                const roomHeight = parseFloat(this.elements.heightInput ? this.elements.heightInput.value : 0);
                                if (!isNaN(roomHeight) && roomHeight > 0) {
                                    field.value = (roomHeight - 0.2).toFixed(1);
                                }
                            } else if (field.id === 'workingPlaneHeight') {
                                field.value = '0.8';
                            }
                        }
                    });
                });
                console.log('✓ Auto-calc button listeners added');
            }
            
            // Unit radios
            const unitRadios = this.container.querySelectorAll('input[name="unit"]');
            if (unitRadios.length > 0) {
                unitRadios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        const unit = e.target.value;
                        if (this.elements.spaceUnitLabel) {
                            if (unit === 'meters') this.elements.spaceUnitLabel.textContent = '(meters)';
                            else if (unit === 'feet') this.elements.spaceUnitLabel.textContent = '(feet)';
                            else if (unit === 'mm') this.elements.spaceUnitLabel.textContent = '(mm)';
                        }
                    });
                });
                console.log('✓ Unit radio listeners added');
            }
            
            // Objective buttons
            const objectiveButtons = this.container.querySelectorAll('.objective-button');
            if (objectiveButtons.length > 0) {
                objectiveButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const objective = e.currentTarget.getAttribute('data-objective');
                        
                        // Update active button
                        objectiveButtons.forEach(btn => btn.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                        
                        // Update hidden input
                        if (this.elements.objectiveInput) this.elements.objectiveInput.value = objective;
                        
                        // Update form display
                        this.toggleCalculationMode();
                    });
                });
                console.log('✓ Objective button listeners added');
            }
            
            // Light source select
            if (this.elements.lightSourceSelect) {
                this.elements.lightSourceSelect.addEventListener('change', (e) => {
                    const sourceType = e.target.value;
                    const predefinedLightsDiv = this.container.querySelector('#predefinedLights');
                    const customLumensDiv = this.container.querySelector('#customLumens');
                    
                    if (predefinedLightsDiv) predefinedLightsDiv.style.display = sourceType === 'predefined' ? 'block' : 'none';
                    if (customLumensDiv) customLumensDiv.style.display = sourceType === 'custom' ? 'block' : 'none';
                    if (this.elements.customLumensInput) this.elements.customLumensInput.required = (sourceType === 'custom');
                });
                console.log('✓ Light source select listener added');
            }
            
            // Room type select
            if (this.elements.roomTypeSelect) {
                this.elements.roomTypeSelect.addEventListener('change', (e) => {
                    if (e.target.value === 'custom') {
                        if (this.elements.targetLuxInput) {
                            this.elements.targetLuxInput.value = '';
                            this.elements.targetLuxInput.readOnly = false;
                        }
                    } else {
                        if (this.elements.targetLuxInput) {
                            this.elements.targetLuxInput.value = e.target.value;
                            this.elements.targetLuxInput.readOnly = true;
                        }
                    }
                });
                console.log('✓ Room type select listener added');
            }
            
            // Copy button
            if (this.elements.copyBtn) {
                this.elements.copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const resultText = this.elements.resultDiv ? this.elements.resultDiv.innerText : '';
                    const summaryText = this.elements.summaryDiv ? this.elements.summaryDiv.innerText : '';
                    const fullText = `LIGHTING CALCULATION RESULTS\n${summaryText}\n\nDETAILED RESULTS:\n${resultText}`;
                    
                    navigator.clipboard.writeText(fullText).then(() => {
                        const originalText = this.elements.copyBtn.textContent;
                        this.elements.copyBtn.textContent = '✅ Copied!';
                        this.elements.copyBtn.classList.add('copied');
                        
                        setTimeout(() => {
                            this.elements.copyBtn.textContent = originalText;
                            this.elements.copyBtn.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                        this.elements.copyBtn.textContent = '❌ Failed to copy';
                    });
                });
                console.log('✓ Copy button listener added');
            }
            
            // Print button
            if (this.elements.printBtn) {
                this.elements.printBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.print();
                });
                console.log('✓ Print button listener added');
            }
            
            // Form submission
            if (this.elements.lightingForm) {
                this.elements.lightingForm.addEventListener('submit', (e) => this.handleSubmit(e));
                console.log('✓ Form submission listener added');
            }
            
            console.log('All event listeners setup complete');
        }
        
        toggleCalculationMode() {
            if (!this.elements.objectiveInput) {
                console.warn('Objective input not found');
                return;
            }
            
            const selectedMode = this.elements.objectiveInput.value;
            console.log(`Toggling calculation mode to: ${selectedMode}`);
            
            if (selectedMode === 'calcLuminaires') {
                if (this.elements.targetLuxContainer) this.elements.targetLuxContainer.style.display = 'block';
                if (this.elements.numLuminairesContainer) this.elements.numLuminairesContainer.style.display = 'none';
                if (this.elements.targetLuxInput) this.elements.targetLuxInput.setAttribute('required', 'required');
                if (this.elements.numLuminairesInput) this.elements.numLuminairesInput.removeAttribute('required');
                if (this.elements.submitBtn) this.elements.submitBtn.textContent = 'Calculate Number of Luminaires';
            } else {
                if (this.elements.targetLuxContainer) this.elements.targetLuxContainer.style.display = 'none';
                if (this.elements.numLuminairesContainer) this.elements.numLuminairesContainer.style.display = 'block';
                if (this.elements.targetLuxInput) this.elements.targetLuxInput.removeAttribute('required');
                if (this.elements.numLuminairesInput) this.elements.numLuminairesInput.setAttribute('required', 'required');
                if (this.elements.submitBtn) this.elements.submitBtn.textContent = 'Calculate Lux Level';
            }
        }
        
        setupRealTimeValidation() {
            const inputs = this.container.querySelectorAll('input[type="number"]');
            if (inputs.length === 0) return;
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                if (['mountingHeight', 'workingPlaneHeight', 'height'].includes(input.id)) {
                    input.addEventListener('input', () => {
                        this.validateHeightRelations();
                    });
                }
            });
        }
        
        validateField(field) {
            const errorSpan = this.container.querySelector(`#${field.id}Error`);
            if (!errorSpan) return true;

            const value = parseFloat(field.value);
            const min = parseFloat(field.min) || 0;
            const max = parseFloat(field.max);

            let isValid = !isNaN(value) && value >= min;
            if (max) isValid = isValid && value <= max;

            errorSpan.style.display = isValid ? 'none' : 'block';
            field.style.borderColor = isValid ? '#cfd8dc' : '#d32f2f';
            
            return isValid;
        }
        
        validateHeightRelations() {
            const height = parseFloat(this.elements.heightInput ? this.elements.heightInput.value : 0);
            const mountingHeight = parseFloat(this.elements.mountingHeightInput ? this.elements.mountingHeightInput.value : 0);
            const workingHeight = parseFloat(this.elements.workingPlaneHeightInput ? this.elements.workingPlaneHeightInput.value : 0);

            const mountingError = this.container.querySelector('#mountingHeightRoomError');
            const workingError = this.container.querySelector('#workingPlaneMountingError');

            if (!isNaN(height) && !isNaN(mountingHeight) && mountingHeight > height) {
                if (mountingError) mountingError.style.display = 'block';
            } else {
                if (mountingError) mountingError.style.display = 'none';
            }

            if (!isNaN(mountingHeight) && !isNaN(workingHeight) && workingHeight >= mountingHeight) {
                if (workingError) workingError.style.display = 'block';
            } else {
                if (workingError) workingError.style.display = 'none';
            }
        }
        
        // Rest of the calculation methods remain the same as before...
        calculateRoomIndex(length, width, mountingHeight, workingPlaneHeight) {
            const Hm = Math.max(0.1, mountingHeight - workingPlaneHeight);
            return (length * width) / (Hm * (length + width));
        }
        
        findClosestLowerValue(value, array) {
            const sortedArray = array.slice().sort((a, b) => a - b);
            for (let i = sortedArray.length - 1; i >= 0; i--) {
                if (sortedArray[i] <= value) return sortedArray[i];
            }
            return sortedArray[0];
        }
        
        estimateUF(roomIndex, ceilingReflectance, wallReflectance) {
            try {
                const roomIndices = Object.keys(this.ufTable).map(Number);
                const closestRoomIndex = this.findClosestLowerValue(roomIndex, roomIndices);
                const ceilingValues = [0.5, 0.7, 0.8];
                const closestCeiling = this.findClosestLowerValue(ceilingReflectance, ceilingValues);
                const wallValues = [0.3, 0.5, 0.7];
                const closestWall = this.findClosestLowerValue(wallReflectance, wallValues);
                return this.ufTable[closestRoomIndex][closestCeiling][closestWall] || 0.6;
            } catch (error) {
                console.error("Error estimating UF:", error);
                return 0.6;
            }
        }
        
        calculateLuminaires(targetLux, area, lumensPerFixture, uf, mf = 0.8) {
            if (lumensPerFixture <= 0 || uf <= 0 || mf <= 0) return Infinity;
            return Math.ceil((targetLux * area) / (lumensPerFixture * uf * mf * this.DIALUX_MULTIPLIER));
        }
        
        calculateOptimalLayout(length, width, numLuminaires) {
            // ... (keep this function exactly as in your original code)
            if (numLuminaires <= 3) {
                return {
                    rows: numLuminaires,
                    columns: 1,
                    spacingX: length / 2,
                    spacingY: width / numLuminaires,
                    wallOffsetX: length / 2,
                    wallOffsetY: width / (numLuminaires * 2),
                    totalLuminaires: numLuminaires,
                    layoutType: 'grid',
                    rowPattern: null
                };
            }

            let bestRows = 1;
            let bestCols = numLuminaires;
            let bestScore = Math.abs((length/width) - (bestCols / bestRows));
            
            for (let rows = 1; rows <= numLuminaires; rows++) {
                if (numLuminaires % rows === 0) {
                    const cols = numLuminaires / rows;
                    const gridAspectRatio = (cols / rows);
                    const roomAspectRatio = (length / width);
                    const score = Math.abs(roomAspectRatio - gridAspectRatio);
                    
                    if (score < bestScore) {
                        bestScore = score;
                        bestRows = rows;
                        bestCols = cols;
                    }
                }
            }
            
            if (bestRows * bestCols === numLuminaires && bestRows > 1 && bestCols > 1) {
                return {
                    rows: bestRows,
                    columns: bestCols,
                    spacingX: length / bestCols,
                    spacingY: width / bestRows,
                    wallOffsetX: (length / bestCols) / 2,
                    wallOffsetY: (width / bestRows) / 2,
                    totalLuminaires: numLuminaires,
                    layoutType: 'grid',
                    rowPattern: null
                };
            }
            
            const baseCols = Math.ceil(Math.sqrt(numLuminaires));
            const fullRows = Math.floor(numLuminaires / baseCols);
            const remainingLights = numLuminaires % baseCols;
            
            let optimalCols = baseCols;
            if (remainingLights > 0 && remainingLights < baseCols - 2) {
                for (let cols = baseCols - 1; cols <= baseCols + 1; cols++) {
                    if (cols <= 0) continue;
                    const testFullRows = Math.floor(numLuminaires / cols);
                    const testRemaining = numLuminaires % cols;
                    if (testRemaining === 0 || (testRemaining >= cols - 1 && testFullRows > 1)) {
                        optimalCols = cols;
                        break;
                    }
                }
            }
            
            const finalFullRows = Math.floor(numLuminaires / optimalCols);
            const finalRemaining = numLuminaires % optimalCols;
            
            const rowPattern = [];
            for (let i = 0; i < finalFullRows; i++) {
                rowPattern.push(optimalCols);
            }
            if (finalRemaining > 0) {
                rowPattern.push(finalRemaining);
            }
            
            const totalRows = rowPattern.length;
            const maxCols = Math.max(...rowPattern);
            
            if (maxCols === 1 && numLuminaires > 3) {
                const newCols = 2;
                const newFullRows = Math.floor(numLuminaires / newCols);
                const newRemaining = numLuminaires % newCols;
                
                const newRowPattern = [];
                for (let i = 0; i < newFullRows; i++) {
                    newRowPattern.push(newCols);
                }
                if (newRemaining > 0) {
                    newRowPattern.push(newRemaining);
                }
                
                return {
                    rows: newRowPattern.length,
                    columns: Math.max(...newRowPattern),
                    spacingX: length / Math.max(...newRowPattern),
                    spacingY: width / newRowPattern.length,
                    wallOffsetX: (length / Math.max(...newRowPattern)) / 2,
                    wallOffsetY: (width / newRowPattern.length) / 2,
                    totalLuminaires: numLuminaires,
                    layoutType: 'staggered',
                    rowPattern: newRowPattern
                };
            }
            
            return {
                rows: totalRows,
                columns: maxCols,
                spacingX: length / maxCols,
                spacingY: width / totalRows,
                wallOffsetX: (length / maxCols) / 2,
                wallOffsetY: (width / totalRows) / 2,
                totalLuminaires: numLuminaires,
                layoutType: 'staggered',
                rowPattern: rowPattern
            };
        }
        
        generateLayoutVisualization(layout, length, width, unit) {
            if (!this.elements.layoutVisualization) return;
            
            const visualization = this.elements.layoutVisualization;
            visualization.innerHTML = '<div class="layout-grid"></div>';
            
            const roomOutline = document.createElement('div');
            roomOutline.className = 'room-outline';
            roomOutline.style.width = '90%';
            roomOutline.style.height = '90%';
            roomOutline.style.top = '5%';
            roomOutline.style.left = '5%';
            visualization.appendChild(roomOutline);
            
            if (layout.layoutType === 'grid') {
                for (let row = 0; row < layout.rows; row++) {
                    for (let col = 0; col < layout.columns; col++) {
                        const luminaire = document.createElement('div');
                        luminaire.className = 'luminaire';
                        
                        const x = (col * layout.spacingX + layout.wallOffsetX) / length * 90 + 5;
                        const y = (row * layout.spacingY + layout.wallOffsetY) / width * 90 + 5;
                        
                        luminaire.style.left = `${x}%`;
                        luminaire.style.top = `${y}%`;
                        
                        visualization.appendChild(luminaire);
                    }
                }
            } else {
                let luminaireCount = 0;
                
                for (let row = 0; row < layout.rows; row++) {
                    const lightsInThisRow = layout.rowPattern[row];
                    
                    for (let col = 0; col < lightsInThisRow; col++) {
                        const luminaire = document.createElement('div');
                        luminaire.className = 'luminaire';
                        
                        const rowCenterOffset = (layout.columns - lightsInThisRow) * layout.spacingX / 2;
                        const x = (col * layout.spacingX + layout.wallOffsetX + rowCenterOffset) / length * 90 + 5;
                        const y = (row * layout.spacingY + layout.wallOffsetY) / width * 90 + 5;
                        
                        luminaire.style.left = `${x}%`;
                        luminaire.style.top = `${y}%`;
                        
                        visualization.appendChild(luminaire);
                        luminaireCount++;
                        
                        if (luminaireCount >= layout.totalLuminaires) break;
                    }
                    
                    if (luminaireCount >= layout.totalLuminaires) break;
                }
            }
        }
        
        generateLayoutInfo(layout, length, width, mountingHeight, workingPlaneHeight, unit) {
            if (!this.elements.layoutInfo) return;
            
            const workingHeight = Math.max(0.1, mountingHeight - workingPlaneHeight);
            
            let layoutDescription = '';
            if (layout.layoutType === 'grid') {
                layoutDescription = `${layout.rows} × ${layout.columns} grid`;
            } else {
                layoutDescription = `Staggered pattern: ${layout.rowPattern.join('-')}`;
            }
            
            this.elements.layoutInfo.innerHTML = `
                <div class="layout-card">
                    <h4>📐 Grid Configuration</h4>
                    <p><strong>Pattern:</strong> ${layoutDescription}</p>
                    <p><strong>Total Fixtures:</strong> ${layout.totalLuminaires}</p>
                    <p><strong>Layout Type:</strong> ${layout.layoutType === 'grid' ? 'Uniform Grid' : 'Staggered Pattern'}</p>
                </div>
                <div class="layout-card">
                    <h4>📏 Spacing Details</h4>
                    <p><strong>X-Spacing:</strong> ${layout.spacingX.toFixed(2)} ${unit}</p>
                    <p><strong>Y-Spacing:</strong> ${layout.spacingY.toFixed(2)} ${unit}</p>
                    <p><strong>Wall Offset:</strong> ${layout.wallOffsetX.toFixed(2)} ${unit}</p>
                </div>
            `;
        }
        
        updateSummary(calculationMode, area, lumensPerFixture, uf, mf, numLuminaires, achievedLux, targetLux) {
            if (!this.elements.summaryDiv || !this.elements.summaryContent) return;
            
            this.elements.summaryDiv.style.display = 'block';
            this.elements.summaryContent.innerHTML = '';
            
            const baseItems = [
                { label: 'Room Area', value: `${area.toFixed(1)} m²` },
                { label: 'Lumens/Fixture', value: `${lumensPerFixture} lm` },
                { label: 'Utilization', value: `${(uf * 100).toFixed(0)}%` },
                { label: 'Dialux Multiplier', value: this.DIALUX_MULTIPLIER.toFixed(3) }
            ];
            
            if (calculationMode === 'calcLuminaires') {
                baseItems.push(
                    { label: 'Target Lux', value: `${targetLux} lux` },
                    { label: 'Luminaires Needed', value: numLuminaires },
                    { label: 'Achieved Lux', value: `${achievedLux.toFixed(0)} lux` }
                );
            } else {
                baseItems.push(
                    { label: 'Luminaires Used', value: numLuminaires },
                    { label: 'Achieved Lux', value: `${achievedLux.toFixed(0)} lux` }
                );
            }
            
            baseItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'summary-item';
                itemDiv.innerHTML = `
                    <div class="summary-value">${item.value}</div>
                    <div class="summary-label">${item.label}</div>
                `;
                this.elements.summaryContent.appendChild(itemDiv);
            });
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Hide previous results
            if (this.elements.resultDiv) this.elements.resultDiv.style.display = 'none';
            if (this.elements.layoutContainer) this.elements.layoutContainer.style.display = 'none';
            if (this.elements.actionButtons) this.elements.actionButtons.style.display = 'none';
            
            // Clear previous errors
            this.container.querySelectorAll('.error').forEach(error => error.style.display = 'none');
            
            // Show loading state
            if (this.elements.submitSpinner) this.elements.submitSpinner.style.display = 'inline-block';
            if (this.elements.submitBtn) this.elements.submitBtn.disabled = true;
            if (this.elements.lightingForm) this.elements.lightingForm.classList.add('loading');
            
            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
                // Get form values
                const length = parseFloat(this.elements.lengthInput ? this.elements.lengthInput.value : 0);
                const width = parseFloat(this.elements.widthInput ? this.elements.widthInput.value : 0);
                const height = parseFloat(this.elements.heightInput ? this.elements.heightInput.value : 0);
                const mountingHeight = parseFloat(this.elements.mountingHeightInput ? this.elements.mountingHeightInput.value : 0);
                const workingPlaneHeight = parseFloat(this.elements.workingPlaneHeightInput ? this.elements.workingPlaneHeightInput.value : 0);
                const ceilingReflect = parseFloat(this.elements.ceilingReflectInput ? this.elements.ceilingReflectInput.value : 0);
                const wallReflect = parseFloat(this.elements.wallReflectInput ? this.elements.wallReflectInput.value : 0);
                const floorReflect = parseFloat(this.elements.floorReflectInput ? this.elements.floorReflectInput.value : 0);
                
                const unitRadios = this.container.querySelectorAll('input[name="unit"]');
                let unit = 'meters';
                unitRadios.forEach(radio => {
                    if (radio.checked) unit = radio.value;
                });
                
                const calculationMode = this.elements.objectiveInput ? this.elements.objectiveInput.value : 'calcLuminaires';
                
                // Validation
                let hasErrors = false;
                
                // Check each field
                const fields = [
                    { id: 'length', value: length, element: this.elements.lengthInput },
                    { id: 'width', value: width, element: this.elements.widthInput },
                    { id: 'height', value: height, element: this.elements.heightInput },
                    { id: 'mountingHeight', value: mountingHeight, element: this.elements.mountingHeightInput },
                    { id: 'workingPlaneHeight', value: workingPlaneHeight, element: this.elements.workingPlaneHeightInput },
                    { id: 'ceilingReflect', value: ceilingReflect, element: this.elements.ceilingReflectInput, min: 0, max: 1 },
                    { id: 'wallReflect', value: wallReflect, element: this.elements.wallReflectInput, min: 0, max: 1 },
                    { id: 'floorReflect', value: floorReflect, element: this.elements.floorReflectInput, min: 0, max: 1 }
                ];
                
                fields.forEach(field => {
                    if (isNaN(field.value) || field.value < (field.min || 0) || (field.max && field.value > field.max)) {
                        const errorElement = this.container.querySelector(`#${field.id}Error`);
                        if (errorElement) errorElement.style.display = 'block';
                        hasErrors = true;
                        if (field.element) field.element.style.borderColor = '#d32f2f';
                    }
                });
                
                if (mountingHeight > height) {
                    const mountingError = this.container.querySelector('#mountingHeightRoomError');
                    if (mountingError) mountingError.style.display = 'block';
                    hasErrors = true;
                }
                
                if (workingPlaneHeight >= mountingHeight) {
                    const workingError = this.container.querySelector('#workingPlaneMountingError');
                    if (workingError) workingError.style.display = 'block';
                    hasErrors = true;
                }
                
                let selectedLumens;
                const lightSource = this.elements.lightSourceSelect ? this.elements.lightSourceSelect.value : 'custom';
                if (lightSource === 'predefined') {
                    const lightTypeSelect = this.container.querySelector('#lightType');
                    selectedLumens = lightTypeSelect ? parseFloat(lightTypeSelect.value) : 1000;
                } else {
                    selectedLumens = parseFloat(this.elements.customLumensInput ? this.elements.customLumensInput.value : 0);
                    if (isNaN(selectedLumens) || selectedLumens <= 0) {
                        const lumensError = this.container.querySelector('#lumensError');
                        if (lumensError) lumensError.style.display = 'block';
                        hasErrors = true;
                    }
                }
                
                let targetLux, numLuminaires;
                if (calculationMode === 'calcLuminaires') {
                    targetLux = parseFloat(this.elements.targetLuxInput ? this.elements.targetLuxInput.value : 0);
                    if (isNaN(targetLux) || targetLux <= 0) {
                        const luxError = this.container.querySelector('#luxError');
                        if (luxError) luxError.style.display = 'block';
                        hasErrors = true;
                    }
                } else {
                    numLuminaires = parseFloat(this.elements.numLuminairesInput ? this.elements.numLuminairesInput.value : 0);
                    if (isNaN(numLuminaires) || numLuminaires < 1 || numLuminaires % 1 !== 0) {
                        const numLuminairesError = this.container.querySelector('#numLuminairesError');
                        if (numLuminairesError) numLuminairesError.style.display = 'block';
                        hasErrors = true;
                    }
                }
                
                if (hasErrors) {
                    throw new Error('Validation failed');
                }
                
                // Unit Conversion to Meters
                let calcLength = length, calcWidth = width, calcHeight = height;
                let calcMountingHeight = mountingHeight, calcWorkingPlaneHeight = workingPlaneHeight;
                let displayUnit = 'm';
                let areaUnit = 'm²';
                
                if (unit === 'feet') {
                    [calcLength, calcWidth, calcHeight, calcMountingHeight, calcWorkingPlaneHeight] = 
                    [length, width, height, mountingHeight, workingPlaneHeight].map(v => v * this.FEET_TO_METERS);
                    displayUnit = 'ft';
                    areaUnit = 'ft²';
                } else if (unit === 'mm') {
                    [calcLength, calcWidth, calcHeight, calcMountingHeight, calcWorkingPlaneHeight] = 
                    [length, width, height, mountingHeight, workingPlaneHeight].map(v => v * this.MM_TO_METERS);
                    displayUnit = 'mm';
                    areaUnit = 'mm²';
                }
                
                const displayArea = (calcLength * calcWidth).toFixed(2);
                
                // Core Calculations
                const roomArea = calcLength * calcWidth;
                const roomIndex = this.calculateRoomIndex(calcLength, calcWidth, calcMountingHeight, calcWorkingPlaneHeight);
                const uf = this.estimateUF(roomIndex, ceilingReflect, wallReflect);
                const mf = 0.8;
                
                let resultHTML = '';
                const commonDetails = `
                    <strong>Room Details:</strong><br>
                    Area: ${displayArea} ${areaUnit}<br>
                    <hr>
                    <strong>Calculated Parameters:</strong><br>
                    Room Index (K): <b>${roomIndex.toFixed(2)}</b><br>
                    Utilization Factor (UF): <b>${(uf * 100).toFixed(1)}%</b><br>
                    Maintenance Factor (MF): <b>${(mf * 100).toFixed(0)}%</b><br>
                    Dialux Alignment Multiplier: <b>${this.DIALUX_MULTIPLIER.toFixed(3)}</b><br>
                    <hr>`;
                
                if (calculationMode === 'calcLuminaires') {
                    targetLux = parseFloat(this.elements.targetLuxInput ? this.elements.targetLuxInput.value : 0);
                    numLuminaires = this.calculateLuminaires(targetLux, roomArea, selectedLumens, uf, mf);
                    const achievedLux = (numLuminaires * selectedLumens * uf * mf * this.DIALUX_MULTIPLIER) / roomArea;
                    
                    let configTable = '<table><tr><th># of Lights</th><th>Achieved Lux</th></tr>';
                    for (let n = 1; n <= 10; n++) {
                        const lux = (n * selectedLumens * uf * mf * this.DIALUX_MULTIPLIER) / roomArea;
                        configTable += `<tr><td>${n}</td><td>${lux.toFixed(1)}</td></tr>`;
                    }
                    configTable += '</table>';
                    
                    resultHTML = `
                        ${commonDetails}
                        <strong>Lighting Results:</strong><br>
                        Number of luminaires needed: <b>${isFinite(numLuminaires) ? numLuminaires : 'N/A'}</b><br>
                        This will achieve an illuminance of: <b>${achievedLux.toFixed(1)} lux</b><br>
                        <hr>
                        <strong>Illuminance Table for Selected Luminaire (${selectedLumens} lm):</strong><br>
                        ${configTable}
                    `;
                    
                    this.updateSummary(calculationMode, roomArea, selectedLumens, uf, mf, numLuminaires, achievedLux, targetLux);
                    
                    if (isFinite(numLuminaires) && numLuminaires > 0) {
                        const layout = this.calculateOptimalLayout(calcLength, calcWidth, numLuminaires);
                        this.generateLayoutVisualization(layout, calcLength, calcWidth, displayUnit);
                        this.generateLayoutInfo(layout, calcLength, calcWidth, calcMountingHeight, calcWorkingPlaneHeight, displayUnit);
                        if (this.elements.layoutContainer) this.elements.layoutContainer.style.display = 'block';
                    }
                } else {
                    numLuminaires = parseInt(this.elements.numLuminairesInput ? this.elements.numLuminairesInput.value : 0);
                    const achievedLux = (numLuminaires * selectedLumens * uf * mf * this.DIALUX_MULTIPLIER) / roomArea;
                    
                    resultHTML = `
                        ${commonDetails}
                        <strong>Lighting Result:</strong><br>
                        Using <b>${numLuminaires}</b> luminaire(s) will achieve an illuminance of:<br>
                        <h2 style="text-align:center; color:#0078d4; margin:10px 0;">${achievedLux.toFixed(1)} lux</h2>
                    `;
                    
                    this.updateSummary(calculationMode, roomArea, selectedLumens, uf, mf, numLuminaires, achievedLux);
                    
                    const layout = this.calculateOptimalLayout(calcLength, calcWidth, numLuminaires);
                    this.generateLayoutVisualization(layout, calcLength, calcWidth, displayUnit);
                    this.generateLayoutInfo(layout, calcLength, calcWidth, calcMountingHeight, calcWorkingPlaneHeight, displayUnit);
                    if (this.elements.layoutContainer) this.elements.layoutContainer.style.display = 'block';
                }
                
                // Show results
                if (this.elements.resultDiv) {
                    this.elements.resultDiv.style.display = 'block';
                    this.elements.resultDiv.innerHTML = resultHTML;
                }
                
                if (this.elements.actionButtons) {
                    this.elements.actionButtons.style.display = 'block';
                }
                
                console.log('Calculation completed successfully');
                
            } catch (error) {
                console.error('Calculation error:', error);
                if (this.elements.resultDiv) {
                    this.elements.resultDiv.style.display = 'block';
                    this.elements.resultDiv.innerHTML = '<div style="color: #d32f2f;">An error occurred during calculation. Please check your inputs.</div>';
                }
            } finally {
                // Hide loading state
                if (this.elements.submitSpinner) this.elements.submitSpinner.style.display = 'none';
                if (this.elements.submitBtn) this.elements.submitBtn.disabled = false;
                if (this.elements.lightingForm) this.elements.lightingForm.classList.remove('loading');
            }
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded, initializing calculator...');
        initLightingCalculator();
    });
    
    // Also initialize if script loads after DOMContentLoaded
    if (document.readyState !== 'loading') {
        console.log('DOM already loaded, initializing calculator immediately...');
        initLightingCalculator();
    }
    
    // Export for potential debugging
    window.LightingCalculator = LightingCalculator;
    window.initLightingCalculator = initLightingCalculator;
    
})();