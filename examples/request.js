export async function request(url, options = {}) {
    const headers = { ...options.headers };

    // const isInternalRequest = url.startsWith("/") || url.includes("your-api-domain.com");
    let isInternalRequest = url.startsWith("/");

    if (!isInternalRequest) {
      try {
        const parsedUrl = new URL(url);
        
        isInternalRequest = parsedUrl.hostname === "your-api-domain.com" || 
                            parsedUrl.hostname === "localhost";
                            
      } catch (e) {
        isInternalRequest = false; 
      }
    }

    if (isInternalRequest) {
        const token = localStorage.getItem("token");

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    if (options.body && typeof options.body === "object") {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, { ...options, headers });
    return handleResponse(response);
}

async function handleResponse(response) {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const errorMessage = data?.message || data || "Network response was not ok";
        throw new Error(errorMessage);
    }

    return data;
}  