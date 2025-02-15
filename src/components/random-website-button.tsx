// export default RandomWebsiteButton
// components/RandomWebsiteButton.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

async function getNewSite(): Promise<{ url?: string; error?: string }> {
  try {
    const response = await fetch("/api/random")
    const data = await response.json()

    if (!data.url) {
      return { error: data.error || "An unknown error occurred" }
    }

    return { url: data.url }
  } catch (error) {
    console.error("Failed to check if embedding is allowed:", error)
    return { error: JSON.stringify(error) || "Unknown error" }
  }
}

const RandomWebsiteButton = () => {
  const [count, setCount] = useState<undefined | number>()

  const openNewWindow = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener")
    if (newWindow) {
      newWindow.opener = null
      newWindow.focus()
    }
  }, [])

  const goToRandomWebsite = useCallback(async () => {
    try {
      const site = await getNewSite()
      if (!site.url)
        throw new Error(site.error || "Failed to get a random website!")
      openNewWindow(site.url)
    } catch (error) {
      // Handle error here, e.g., display user-friendly message or log to a centralized system
      console.error("Failed to go to a new website:", error)
    }
  }, [openNewWindow])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/count")
        const data = await response.json()
        setCount(data.count)
      } catch (error) {
        console.error("Failed to fetch count:", error)
      }
    }

    fetchCount()
  }, [])

  return (
    <div>
      <Button onClick={goToRandomWebsite}>
        {`FUMBLE UPON${count === undefined ? "" : ` ${count} Dapps`}`}
      </Button>
    </div>
  )
}

export default RandomWebsiteButton
