# ToolCard Component Refactor - Requirements

## Overview

The ToolCard component needs immediate fixes due to a corrupted edit, plus several improvements for code quality, maintainability, and performance.

## Critical Issues (Must Fix)

### 1.1 Corrupted Component Structure

**Priority**: Critical
**Description**: The recent edit broke the component - the JSX structure is incomplete with a truncated gradient class and missing closing tags.

**Acceptance Criteria**:

- Component renders without errors
- All JSX elements are properly closed
- Gradient classes are complete and valid
- No syntax errors in the file

## Code Quality Improvements

### 2.1 Extract Star Rating Logic

**Priority**: High
**Description**: The `renderStars()` function contains complex inline style calculations that are duplicated and hard to maintain.

**Acceptance Criteria**:

- Star styling logic extracted to separate helper functions
- Style calculations are reusable and testable
- Reduced duplication in star state determination
- Code is more readable and maintainable

### 2.2 Simplify Conditional Logic

**Priority**: Medium
**Description**: Multiple ternary operators for determining star states make the code hard to read.

**Acceptance Criteria**:

- Star state (user-rated, average-rated, unrated) determined by a single function
- Style objects created based on state rather than inline conditionals
- Improved readability without changing functionality

### 2.3 Extract Magic Values to Constants

**Priority**: Medium
**Description**: Color values, sizes, and other magic values are hardcoded throughout the component.

**Acceptance Criteria**:

- Color values extracted to named constants
- Size values (widths, heights) extracted to constants
- Constants defined at module level or in a separate config
- Easier to maintain and update styling

### 2.4 Memoize Expensive Computations

**Priority**: Low
**Description**: Language-based text selection happens on every render even when language hasn't changed.

**Acceptance Criteria**:

- Use `useMemo` for description, freeTier, limitations, and categoryName
- Only recompute when language or tool data changes
- Improved performance for lists with many cards

## Accessibility Improvements

### 3.1 Improve Star Rating Accessibility

**Priority**: Medium
**Description**: Star rating buttons need better ARIA labels and keyboard navigation support.

**Acceptance Criteria**:

- Each star button has descriptive aria-label
- Current rating announced to screen readers
- Keyboard navigation works smoothly
- Focus indicators are visible

### 3.2 Add Semantic HTML

**Priority**: Low
**Description**: The card could use more semantic HTML elements for better accessibility.

**Acceptance Criteria**:

- Use `<article>` for the card wrapper
- Use appropriate heading levels
- Add ARIA landmarks where appropriate

## Performance Optimizations

### 4.1 Optimize Re-renders

**Priority**: Low
**Description**: Component may re-render unnecessarily when parent updates.

**Acceptance Criteria**:

- Wrap component in `React.memo` with custom comparison
- Only re-render when tool data or user rating changes
- Maintain all existing functionality

## Code Organization

### 5.1 Extract Star Component

**Priority**: Medium
**Description**: The star rating UI is complex enough to be its own component.

**Acceptance Criteria**:

- Create separate `StarRating` component
- Component accepts rating, onRate, and display props
- Reusable across the application
- Maintains all current styling and behavior

### 5.2 Type Safety Improvements

**Priority**: Low
**Description**: Some type assertions could be stronger.

**Acceptance Criteria**:

- Rating type is properly constrained (1-5)
- Style objects have proper TypeScript types
- No `any` types used

## Non-Functional Requirements

### 6.1 Maintain RTL Support

**Description**: All changes must preserve right-to-left language support.

**Acceptance Criteria**:

- RTL layout works correctly
- Text direction is appropriate
- No visual regressions in Arabic mode

### 6.2 Maintain Dark Mode Support

**Description**: All changes must preserve dark mode theming.

**Acceptance Criteria**:

- Dark mode styles work correctly
- CSS variables are used appropriately
- No visual regressions in dark mode

### 6.3 Maintain Responsive Design

**Description**: Component must work on all screen sizes.

**Acceptance Criteria**:

- Mobile layout works correctly
- Tablet layout works correctly
- Desktop layout works correctly
- No horizontal scrolling issues
