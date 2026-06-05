# 🎨 School App Brand System

## Color Palette

### 🔵 Primary Color - Trust & Structure
**Color:** `#0B1F3A` (Navy Blue)

**Use Cases:**
- App backgrounds
- Headers & navigation
- Loading screen background
- Text (primary)
- Dark themed elements

**Example:**
```tsx
backgroundColor: BrandColors.primary
```

---

### 🟠 Accent Color - Action & Energy
**Color:** `#FF7A00` (Orange)

**Use Cases:**
- Action buttons (Login, Submit, Save)
- Icons & indicators
- Progress spinners
- Active/highlighted tabs
- CTA elements

**Example:**
```tsx
backgroundColor: BrandColors.accent
color: BrandColors.accent
```

---

### ⚪ Neutral Color - Clarity & Readability
**Color:** `#FFFFFF` (White)

**Use Cases:**
- Card backgrounds
- Form inputs
- Text (on dark backgrounds)
- Clean UI surfaces
- Contrast elements

**Example:**
```tsx
backgroundColor: BrandColors.white
color: BrandColors.white
```

---

## Extended Palette

| Color | Hex Code | Use Case |
|-------|----------|----------|
| Success | `#34C759` | Success states, checkmarks |
| Error | `#FF3B30` | Errors, validation fails |
| Warning | `#FF9500` | Warnings, alerts |
| Gray 100 | `#F5F5F5` | Light backgrounds |
| Gray 500 | `#999999` | Muted text, secondary labels |
| Gray 800 | `#424242` | Dark backgrounds (dark mode) |

---

## How to Use in Code

### 1. Import the theme constants
```tsx
import { BrandColors, Typography, Spacing, BorderRadius } from '@/constants/theme';
```

### 2. Use in StyleSheet
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  button: {
    backgroundColor: BrandColors.accent,
    paddingVertical: Spacing.sm,
  },
  text: {
    color: BrandColors.white,
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },
});
```

### 3. Quick Reference
```tsx
// Colors
BrandColors.primary    // #0B1F3A (Navy)
BrandColors.accent     // #FF7A00 (Orange)
BrandColors.white      // #FFFFFF (White)
BrandColors.success    // #34C759
BrandColors.error      // #FF3B30

// Spacing
Spacing.xs             // 4px
Spacing.sm             // 8px
Spacing.md             // 16px
Spacing.lg             // 24px
Spacing.xl             // 32px

// Typography
Typography.h1          // 32px
Typography.body        // 14px
Typography.caption     // 12px
Typography.bold        // '700'

// Border Radius
BorderRadius.sm        // 4px
BorderRadius.md        // 8px
BorderRadius.lg        // 12px
BorderRadius.full      // 9999px (circle)
```

---

## Component Examples

### Button
```tsx
<TouchableOpacity style={{
  backgroundColor: BrandColors.accent,
  paddingVertical: Spacing.md,
  paddingHorizontal: Spacing.lg,
  borderRadius: BorderRadius.md,
}}>
  <Text style={{
    color: BrandColors.white,
    fontWeight: Typography.bold,
  }}>
    Submit
  </Text>
</TouchableOpacity>
```

### Card
```tsx
<View style={{
  backgroundColor: BrandColors.white,
  borderRadius: BorderRadius.lg,
  padding: Spacing.lg,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}}>
  <Text style={{
    color: BrandColors.primary,
    fontWeight: Typography.semibold,
  }}>
    Card Title
  </Text>
</View>
```

### Screen Background
```tsx
<View style={{
  flex: 1,
  backgroundColor: BrandColors.white,
  paddingHorizontal: Spacing.md,
}}>
  {/* Content */}
</View>
```

---

## Design Philosophy

**Your app communicates:**
- 🔵 **Seriousness** - Education & structure (primary blue)
- 🟠 **Energy** - Student activity & engagement (accent orange)
- ⚪ **Clarity** - Readability & trust (neutral white)

This creates an **institution-grade school system UI** that feels professional and modern.

---

## Files to Know

- **Theme Definition:** `src/constants/theme.ts`
- **Loading Screen:** `src/components/LoadingScreen.tsx`
- **App Config:** `app.json` (splash screen colors)
- **Splash Image:** `assets/splash.png`

---

## Future Enhancements

Once basic theme is applied, consider:
- ✅ Animated splash transitions
- ✅ Role-based dashboard styling
- ✅ Modern UI component library
- ✅ Dark mode full implementation
- ✅ Accessibility (high contrast mode)
