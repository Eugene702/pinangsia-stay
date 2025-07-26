import { showToast } from "./toast"

/**
 * Copy text to clipboard with fallback support for older browsers
 * and non-secure contexts (HTTP)
 */
export const copyToClipboard = async (
  text: string, 
  successMessage?: string, 
  errorMessage?: string
): Promise<boolean> => {
  const defaultSuccessMessage = "Copied to clipboard!"
  const defaultErrorMessage = "Failed to copy to clipboard. Please copy manually."

  try {
    // Modern clipboard API (requires HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      showToast("success", successMessage || defaultSuccessMessage)
      return true
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          showToast("success", successMessage || defaultSuccessMessage)
          return true
        } else {
          throw new Error('execCommand failed')
        }
      } catch (err) {
        showToast("error", errorMessage || defaultErrorMessage)
        console.error('Fallback copy failed:', err)
        return false
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (err) {
    showToast("error", errorMessage || defaultErrorMessage)
    console.error('Copy to clipboard failed:', err)
    return false
  }
}

/**
 * Check if clipboard API is available
 */
export const isClipboardSupported = (): boolean => {
  return (
    (navigator.clipboard && window.isSecureContext) || 
    document.queryCommandSupported?.('copy') === true
  )
}
