# **Lighting Calculation Tool Documentation**

## **📋 Overview**
This is a basic lighting calculation tool that helps users determine optimal lighting requirements for various spaces. Built with **HTML, CSS, and JavaScript**, it's designed to be easily integrated into Shopify stores while maintaining full functionality as a standalone application.

---

## **📁 Project Structure**

### **Version 1: Standalone Web App**
- **`index.html`** - Complete standalone version (HTML + CSS + JS in one file)
- Perfect for testing, demos, or independent deployment
- No external dependencies needed

### **Version 2: Shopify Integration Files**
- **`lighting-calculator.liquid`** - Shopify section file
- **`lighting-calculator.css`** - Styles for Shopify
- **`lighting-calculator.js`** - Calculation logic for Shopify

---

## **✨ Features**

### **🔦 Core Calculations**
- **Total Luminaires Needed** - Determines number of light fixtures required
- **Achieved Lux Level** - Calculates illuminance from existing setup
- **Room Index (K)** - Accounts for room proportions
- **Utilization Factor (UF)** - Estimates light usage efficiency
- **Light Loss Factor (LLF)** - Includes maintenance considerations
- **Dialux Multiplier (1.097)** - Industry-standard adjustment factor

### **📐 Layout & Visualization**
- **Grid Layout** - Standard rectangular arrangement
- **Staggered Layout** - Offset pattern for better coverage
- **Interactive Room Preview** - Visual representation with dimensions
- **Spacing Optimization** - Calculates ideal fixture placement

### **⚡ Presets & Convenience**
- **Room Type Presets** (Office, Classroom, Corridor, etc.)
- **Reflectance Presets** - Common ceiling/wall/floor combinations
- **Automatic Height Settings** - Standard mounting and working plane values
- **Example Mode** - Quick testing with pre-filled values

### **✅ Validation & User Experience**
- **Real-time Input Validation** - Instant error feedback
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clear Error Messages** - Helps users correct mistakes
- **Results Summary** - Easy-to-read calculation outputs

---

## **🚀 Quick Start Guide**

### **Option 1: Standalone Version**
1. Open `index.html` in any web browser
2. No installation or setup required
3. All features work immediately

### **Option 2: Shopify Integration**
1. Follow the [Shopify Integration SOP](link-to-your-SOP)
2. Upload the three Shopify files to your theme
3. Add `{% section 'lighting-calculator' %}` to any page
4. The calculator will appear with full functionality

---

## **🛠️ How to Use the Calculator**

### **Step 1: Room Dimensions**
- Enter length, width, and height
- Choose measurement units (meters/feet)
- Select room type for autofill

### **Step 2: Calculation Mode**
Choose what you want to calculate:
- **Luminaires Needed** - How many lights are required
- **Achieved Lux Level** - What illumination you'll get

### **Step 3: Lighting Details**
- Input lumens per fixture
- Set reflectance values (ceiling/walls/floor)
- Adjust maintenance factor
- Choose layout preference

### **Step 4: Get Results**
- View calculated requirements
- Check layout visualization
- Review technical values (Room Index, UF, etc.)
- See spacing recommendations

---

## **🎯 Use Cases**

### **🏢 Commercial Applications**
- Office lighting design
- Retail store illumination
- Warehouse lighting planning
- Educational facilities

### **🏠 Residential Applications**
- Home office setup
- Kitchen lighting
- Living room arrangements
- Workshop areas

### **📐 Professional Services**
- Lighting designers
- Architects
- Interior designers
- Facility managers

---

## **🔧 Technical Details**

### **Formulas Used**
- **Room Index (K)** = (L × W) ÷ [H × (L + W)]
- **Luminaires Needed** = (E × A) ÷ (Φ × UF × MF × DF)
- **Achieved Lux** = (N × Φ × UF × MF × DF) ÷ A

**Where:**
- E = Required illuminance (lux)
- A = Room area
- Φ = Lumens per fixture
- UF = Utilization factor
- MF = Maintenance factor
- DF = Dialux multiplier (1.097)
- N = Number of luminaires

### **Browser Compatibility**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

### **Performance**
- All calculations client-side (no server needed)
- Instant results with no page reload
- Minimal resource usage
- Fast loading times

---

## **📊 Input Validation**

The tool checks for:
- ✅ Positive numerical values
- ✅ Logical height relationships
- ✅ Valid reflectance percentages (0-100%)
- ✅ Appropriate maintenance factors
- ✅ Unit consistency

**Error messages guide users to correct inputs immediately.**

---

## **🎨 Design Features**

### **User Interface**
- Clean, professional appearance
- Logical grouping of related inputs
- Clear visual hierarchy
- Consistent color coding
- Progress indicators

### **Responsive Behavior**
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Adjusted spacing, stacked where needed
- **Mobile**: Single column, touch-friendly controls
- **Print**: Optimized results display

### **Accessibility**
- High contrast text
- Keyboard navigable
- Screen reader friendly
- Clear focus states

---

## **🔄 Integration Options**

### **Shopify**
1. Upload the three separate files
2. Add to any page with Liquid code
3. Style automatically matches your theme

### **Other Platforms**
- **WordPress**: Use as HTML block or custom plugin
- **Wix/Squarespace**: Embed via iframe or custom code
- **Standalone**: Deploy `index.html` anywhere

### **Customization**
- Modify colors in CSS variables
- Adjust presets in JavaScript arrays
- Add new room types easily
- Extend with additional calculations

---

## **📈 Example Calculations**

### **Example 1: Office Lighting**
- Room: 10m × 8m × 3m
- Required: 500 lux
- Fixture: 3500 lumens
- **Result**: 12 luminaires needed

### **Example 2: Classroom**
- Room: 12m × 9m × 3.5m
- Existing: 24 fixtures at 4000 lumens
- **Result**: Achieves 480 lux

---

## **⚠️ Important Notes**

### **Professional Use**
- This tool provides **estimates only**
- Always verify with professional lighting software
- Consider specific room conditions
- Account for furniture and decor

### **Limitations**
- Assumes uniform lighting requirements
- Simplified reflectance calculations
- Does not account for natural light
- Standard mounting heights assumed

### **Accuracy Factors**
- Results depend on input accuracy
- Reflectance values are estimates
- Maintenance factors vary by environment
- Use as planning tool, not final specification

---

## **🔍 Troubleshooting**

| Issue | Solution |
|-------|----------|
| Calculator not loading | Check browser console for errors |
| Calculations seem wrong | Verify all inputs are correct |
| Mobile display issues | Ensure responsive CSS is loaded |
| Shopify integration fails | Check Liquid syntax and file names |

---

## **📚 Resources & References**

### **Industry Standards**
- IESNA (Illuminating Engineering Society) guidelines
- CIBSE (Chartered Institution of Building Services Engineers)
- Local building codes and regulations

### **Further Learning**
- Lighting design principles
- Lumen method calculations
- Energy efficiency standards
- Sustainable lighting practices

---

## **🔄 Version History**

- **v1.0** - Initial release with basic calculations
- **v1.1** - Added layout visualization
- **v1.2** - Improved validation and presets
- **v1.3** - Shopify integration files added
- **v1.4** - Enhanced mobile responsiveness
- **Current** - Full feature set with both standalone and Shopify versions

---

## **👨‍💻 Development & Contribution**

### **Code Organization**
- **HTML**: Semantic structure with clear sections
- **CSS**: Modular styling with variables
- **JavaScript**: Object-oriented calculation logic
- **Comments**: Detailed explanations throughout

### **Extending the Tool**
To add new features:
1. Update calculation functions in JavaScript
2. Add corresponding HTML inputs
3. Style new elements in CSS
4. Test thoroughly before deployment

---

## **📞 Support & Contact**

For questions, suggestions, or issues:
- Review the [Shopify Integration SOP](link-to-your-SOP)
- Check the troubleshooting section above
- Verify all inputs and settings
- Test with example values first

---

**Last Updated**: [Current Date]  
**Version**: 1.4  
**Author**: [Your Name/Organization]

---

*Disclaimer: This tool is designed for preliminary lighting calculations. Professional lighting design requires consideration of many additional factors. Always consult with qualified lighting professionals for final designs and specifications.*
