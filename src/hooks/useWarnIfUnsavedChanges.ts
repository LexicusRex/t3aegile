import { useEffect, useState } from "react";

export const useWarnIfUnsavedChanges = (isDirty: boolean) => {
  const [navigationAttempted, setNavigationAttempted] = useState(false);
  /**
   * Function that will be called when the user selects `yes` in the confirmation modal,
   * redirected to the selected page.
   */

  useEffect(() => {
    // Used to make popstate event trigger when back button is clicked.
    // Without this, the popstate event will not fire because it needs there to be a href to return.
    if (typeof window !== "undefined") {
      window.history.pushState(null, document.title, window.location.href);
    }

    /**
     * Used to prevent navigation when use click in navigation `<Link />` or `<a />`.
     * @param e The triggered event.
     */
    const handleClick = (event: MouseEvent) => {
      if (isDirty) {
        event.preventDefault();
        setNavigationAttempted(true);
      }
    };
    /* ********************************************************************* */

    /**
     * Used to prevent navigation when use `back` browser buttons.
     */
    const handlePopState = () => {
      if (isDirty) {
        window.history.pushState(null, document.title, window.location.href);
        setNavigationAttempted(true);
      } else {
        window.history.back();
      }
    };
    /* ********************************************************************* */

    /**
     * Used to prevent navigation when reload page or navigate to another page, in diffenret origin.
     * @param e The triggered event.
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        setNavigationAttempted(true);
        e.returnValue = "";
      }
    };
    /* ********************************************************************* */

    /* *************************** Open listeners ************************** */
    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", handleClick);
    });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    /* ************** Return from useEffect closing listeners ************** */
    return () => {
      document.querySelectorAll("a").forEach((link) => {
        link.removeEventListener("click", handleClick);
      });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return {
    navigationAttempted,
    resetNavigationAttempted: () => setNavigationAttempted(false),
  };
};
