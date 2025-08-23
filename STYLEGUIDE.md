# CHUMS Checkin Style Guide

## Overview
This style guide defines the design system for the CHUMS Checkin React Native/Expo application. It provides consistent patterns for colors, typography, spacing, and component design across the entire application.

## Colors

### Primary Brand Colors
- **Primary Blue**: `#1565C0` - Main brand color, used for primary buttons, headers, and key UI elements
- **Light Blue**: `#568BDA` - Secondary blue for subheaders and accent elements
- **Bright Blue**: `#2196F3` - Alternative blue for icons and highlights

### Neutral Colors
- **Background**: `#F6F6F8` (Ghost White) - Main app background
- **Login Background**: `#EEE` - Light gray for login screens
- **White**: `#FFFFFF` - Cards, input fields, and content areas
- **Dark Gray**: `#3c3c3c` - Primary text color
- **Medium Gray**: `#9E9E9E` - Secondary text and icons
- **Light Gray**: `lightgray` - Borders and dividers

### Status Colors
- **Success Green**: `#70DC87` - Success states and confirmations
- **Warning Yellow**: `#FEAA24` - Warnings and attention states
- **Error Red**: `#B0120C` - Error states and destructive actions
- **Info Cyan**: `#1C9BA0` - Information and secondary actions

## Typography

### Font Family
- **Primary Font**: Roboto family with various weights
  - `Roboto-Regular` - Body text
  - `Roboto-Light` - Headings and labels
  - `Roboto-Medium` - Emphasized text and buttons
  - `Roboto-Bold` - Strong emphasis
  - `Roboto-Thin` - Subtle text

### Font Sizes (Responsive)
All font sizes are calculated as percentages of device width for responsive design:
- **H1**: 5% of device width (`fontSize2`)
- **H2**: 4.5% of device width (`fontSize1`) 
- **Body**: 4% of device width (`fontSize`)
- **Small**: 3.6% of device width (`smallFont`)
- **Smaller**: 3% of device width (`smallerFont`)

## Spacing & Dimensions

### Responsive Sizing
The app uses `DimensionHelper.wp()` and `DimensionHelper.hp()` for responsive dimensions:
- `wp(percentage)` - Width percentage of screen
- `hp(percentage)` - Height percentage of screen

### Common Spacing Values
- **Small**: `wp("2%")` - Tight spacing
- **Medium**: `wp("4%")` - Standard spacing
- **Large**: `wp("8%")` - Generous spacing
- **Extra Large**: `wp("12%")` - Major section spacing

## Component Patterns

### Cards
```javascript
{
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
  padding: DimensionHelper.wp("4%")
}
```

### Buttons

#### Primary Button
```javascript
{
  backgroundColor: "#1565C0",
  borderRadius: 8,
  height: DimensionHelper.wp("11%"),
  justifyContent: "center",
  alignItems: "center",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3
}
```

#### Large Link Button
```javascript
{
  width: DimensionHelper.wp("90%"),
  height: DimensionHelper.wp("15%"),
  backgroundColor: "white",
  borderRadius: DimensionHelper.wp("2%"),
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: DimensionHelper.wp("1.5%"),
  elevation: 5,
  shadowColor: "#2196F3"
}
```

### Input Fields
```javascript
{
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "rgba(0, 0, 0, 0.12)",
  height: DimensionHelper.wp("12%"),
  paddingHorizontal: DimensionHelper.wp("3.5%"),
  flexDirection: "row",
  alignItems: "center"
}
```

## Layout Patterns

### Main Container
```javascript
{
  paddingHorizontal: "5%",
  backgroundColor: "#F6F6F8",
  flex: 1
}
```

### Header Design
The app uses two header patterns:

#### Standard Header
- White background with rounded bottom corners
- Church logo prominently displayed
- Printer status bar with version info

#### Prominent Header
- Dark blue background (`#1565C0`)
- White logo container with shadow
- Compact printer status

### Subheader Pattern
- Light blue background (`#568BDA`)
- Rounded bottom corners
- Icon + title + subtitle layout
- White text with semi-transparent icon container

## Material Design Influence

The app follows Material Design principles with:
- **Elevation**: Cards and buttons use consistent shadow patterns
- **Ripple Effects**: Interactive elements use `react-native-material-ripple`
- **Color Depth**: Layered color system with primary, secondary, and surface colors
- **Typography Scale**: Consistent font sizing and hierarchy

## Responsive Design

### Breakpoints
- The app is primarily designed for tablets in kiosk mode
- Landscape orientation adjustments for headers and logos
- Responsive font sizes based on screen width

### Adaptive Components
- Header height adjusts in landscape mode
- Logo sizing adapts to available space
- Card layouts remain consistent across screen sizes

## Usage Guidelines

### Do's
- Use `DimensionHelper.wp()` for all width-based measurements
- Apply consistent shadow patterns for elevation
- Use brand colors for primary actions
- Maintain 8dp grid system for spacing
- Use Roboto font family consistently

### Don'ts
- Avoid hardcoded pixel values
- Don't mix different shadow patterns
- Avoid using colors outside the defined palette
- Don't break the responsive grid system
- Avoid inconsistent typography weights

## Component Examples

### Login Card
Follows Material Design card pattern with:
- White background
- 12px border radius
- Subtle shadow
- Proper padding and spacing
- Consistent input field styling

### Church Selection
- Grid layout for church cards
- Logo containers with fallback icons
- Consistent card styling
- Loading states with branded colors

### Service Selection
- Large, accessible buttons
- Color-coded service times
- Proper touch targets
- Clear visual hierarchy

## Accessibility

### Color Contrast
- Dark text on light backgrounds meets WCAG guidelines
- Button text uses sufficient contrast ratios
- Status colors are supplemented with icons where needed

### Touch Targets
- Minimum 44px touch targets for all interactive elements
- Proper spacing between clickable elements
- Clear visual feedback for interactions

## Implementation

All styles are centralized in:
- `src/helpers/Styles.ts` - Main style definitions
- `src/helpers/DimensionHelper.ts` - Responsive utilities
- Individual component files for component-specific styles

This style guide ensures consistent, accessible, and maintainable design across the CHUMS Checkin application.