import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotify } from "../../context/NotificationProvider";

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const HomePage = ({modalMode, setModalMode}) => {
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {addNotification} = useNotify();
    const abortControllerRef = useRef(null);

    useEffect(() => {
        loadProducts();

        async function loadProducts() {
            setLoading(true);
            try {
                const { products } = await getAllProducts();
                setProducts(products);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        async function getAllProducts() {
            abortControllerRef.current = new AbortController();

            const response = await fetch("http://localhost:5000/api/products", {
                signal: abortControllerRef.current.signal
            });

            const contentType = response.headers.get("content-type");
        
            if (!response.ok) {
                let errorMessage = "An error occurred";

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    errorMessage = await response.text();
                }
                
                throw new Error(errorMessage);
            }
        
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.log(result);

                return {
                    products: result.data
                };
            }
        
            throw new Error("Invalid response format received from server");
        }

        return () => {
            abortControllerRef.current?.abort();
        }
    }, []);

    if (error) {
        return (
            <header className="main-header">
                <h1>{error}</h1>
            </header>
        )
    }

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    async function deleteProduct(pid) {
        // pid = 1;
        const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Deletion failed";

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text();
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            
            throw error;
        }
    
        const result = await response.json();

        return result;
    }

    async function handleDeleteProduct(pid) {
        try {
            await deleteProduct(pid);
            setProducts(prevProducts => prevProducts.filter(p => p._id !== pid));
            addNotification(`Product ${pid} deleted`);
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, "error");
        }
    }

    async function updateProduct(pid, updatedProduct) {
            const response = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Update failed";
    
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    errorMessage = await response.text();
                }
    
                const error = new Error(errorMessage);
                error.status = response.status;
                
                throw error;
            }
        
            const result = await response.json();
    
            return result;
	}

    async function handleUpdateProduct(pid, updatedProduct) {
        try {
            await updateProduct(pid, updatedProduct);
            // setProducts(prevProducts => prevProducts.filter(p => p._id !== pid));
            const updatedProducts = products.map(product => product._id !== pid ? result.data : product);
            setProducts(updatedProducts);
            addNotification(`Product ${pid} updated`);
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, "error");
        }
    }

//     class RequestManager {
//         constructor() {
//             this.controllers = new Map()
//         }

//         async fetch(key, url, options = {}) {
//             this.cancel(key);

//             const controller = new AbortController();
//             this.controllers.set(key, controller);

//             try {
//                 const response = await fetch(url, {
//                     ...options,
//                     signal: controller.signal
//                 })

//                 return response;
//             } finally {
//                 this.controllers.delete(key);
//             }
//         }

//         cancel(key) {
//             const controller = this.controllers.get(key);

//             if (controller) {
//                 controller.abort();
//                 this.controllers.delete(key);
//             }
//         }

//         cancelAll() {
//             for (const controller of this.controllers.values()) {
//                 controller.abort();
//             }
//             this.controllers.clear();
//         }
//     }

// const requestManager = new RequestManager();

// requestManager.fetch("user-profile", "/api/user/123");
// requestManager.fetch("user-posts", "/api/user/123/posts");

// requestManager.cancel("user-profile");

// requestManager.cancelAll();

    return (
        <>
            {products.length === 0 ? (
                <header className="main-header">
                    <h1>No products found</h1>
                    <Link
                        to="/create"
                        className="redirect-link"
                    >
                        Create a product
                    </Link>
                </header>
            ) : (
                <ProductsSection
                    products={products}
                    handleDeleteProduct={handleDeleteProduct}
                    handleUpdateProduct={handleUpdateProduct}
                    setModalMode={setModalMode}
                />
            )}
        </>
    );
};

function ProductsSection({ products, handleDeleteProduct, handleUpdateProduct, setModalMode }) {
    const [editedProduct, setEditedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal(e) {
        e.stopPropagation();
        setIsModalOpen(true);
        // setEditedProduct({...product});
    }
    
    function hadleEditProduct(e, product) {
        openModal(e);
        setEditedProduct({...product});
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <>
            <header className="main-header">
                <h1>Current Products</h1>
            </header>
            <div className="main-body">
                <section className="section">
                    <div className="products">
                        {products.map(product => (
                            <ProductCardAsLink
                                key={product._id} 
                                product={product} 
                                handleDeleteProduct={handleDeleteProduct} 
                                handleUpdateProduct={handleUpdateProduct}
                                hadleEditProduct={hadleEditProduct}
                            />
                            // <ProductCard 
                            //     key={product._id} 
                            //     product={product} 
                            //     handleDeleteProduct={handleDeleteProduct} 
                            //     handleUpdateProduct={handleUpdateProduct}
                            // />
                        ))}
                    </div>
                </section>
            </div>

            <Modal isModalOpen={isModalOpen} setModalMode={setModalMode} onClose={closeModal} title={"Edit product"}>
                {isModalOpen ? <form className="modal-form centered"
                    onSubmit={(e) => handleUpdateProduct(e, id, editedProduct)}
                >
                    <input
                        className="form-input"
                        name="name"
                        value={editedProduct.name}
                        onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                        placeholder="Product Name"
                    />
                    <input
                        className="form-input"
                        type="number"
                        name="price"
                        value={editedProduct.price}
                        onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                        placeholder="Price"
                    />
                    <input
                        className="form-input"
                        name="image"
                        value={editedProduct.image}
                        onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                        placeholder="Image URL"
                    />

                    <button className="btn">
                        Edit Product
                    </button>
                </form> : null}
            </Modal>

            <Links products={products} />
        </>
    )
}

function ProductCard({ product, handleDeleteProduct, handleUpdateProduct }) {
    return (
        <article className="product-card">
            <img src={product.image} alt={product.name} />

            <div className="content">
                <h2>{product.name}</h2>
                <data className="price" value={product.price}>${product.price}</data>
            </div>

            <div className="actions">
                <button
                    type="button"
                    className="icon edit-btn"
                    title="Edit"
                >
                    <span className="sr-only">Edit product {product.name}</span>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <button
                    type="button"
                    className="icon delete-btn"
                    title="Delete"
                    onClick={() => handleDeleteProduct(product._id)}
                >
                    <span className="sr-only">Delete product {product.name}</span>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>

            <footer className="metadata">
                <p>{formatDate(new Date(product.createdAt))}</p>
            </footer>
        </article>
    );
};


function ProductCardLink({ product, handleDeleteProduct, handleUpdateProduct }) {
    return (
        <article className="product-card">
            <img src={product.image} alt={product.name} />

            <div className="content">
                <h2>
                    <Link to={`/products/${product._id}`} className="main-card-link">
                        {product.name}
                    </Link>
                </h2>
                <data className="price" value={product.price}>${product.price}</data>
            </div>

            <div className="actions">
                <button
                    type="button"
                    className="icon edit-btn"
                    title="Edit"
                >
                    <span className="sr-only">Edit product {product.name}</span>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <button
                    type="button"
                    className="icon delete-btn"
                    title="Delete"
                    onClick={() => handleDeleteProduct(product._id)}
                >
                    <span className="sr-only">Delete product {product.name}</span>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>

            <footer className="metadata">
                <p>{formatDate(new Date(product.createdAt))}</p>
            </footer>
        </article>

        // <div className="product-card">

        //     <a href="/products/1" tabIndex="-1" aria-hidden="true">
        //         <img src="shirt.jpg" alt="" />
        //     </a>

        //     <h3>
        //         <a href="/products/1">Blue Shirt</a>
        //     </h3>

        //     <p>Our best selling shirt.</p>

        //     <button
        //         type="button"
        //         className="icon edit-btn"
        //         title="Edit"
        //     >
        //         <span className="sr-only">Edit product {product.name}</span>
        //         <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
        //     </button>
        //     <button
        //         type="button"
        //         className="icon delete-btn"
        //         title="Delete"
        //         onClick={() => handleDeleteProduct(product._id)}
        //     >
        //         <span className="sr-only">Delete product {product.name}</span>
        //         <i className="fa fa-trash-o" aria-hidden="true"></i>
        //     </button>
        // </div>
    );
}

function ProductCardAsLink({ product, handleDeleteProduct, hadleEditProduct }) {
    const linkRef = useRef(null);

    function openProductPage(e) {
        // e.preventDefault();
        linkRef.current.click();
        console.log("clicked");
    }

    function handleDeleteProductWithStop(e, pid) {
        e.stopPropagation();
        handleDeleteProduct(pid);
    }

    return (
        <article className="product-card" onClick={openProductPage}>
            <img src={product.image} alt={product.name} />

            <div className="content">
                <h2>
                    <Link to={`/products/${product._id}`} className="main-card-link1" ref={linkRef}>
                        {product.name}
                    </Link>
                </h2>
                <data className="price" value={product.price}>${product.price}</data>
                <p onClick={e => e.stopPropagation()}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet eos labore, ratione similique error culpa. Voluptates corrupti quisquam accusantium quasi omnis, nisi numquam nihil itaque eos atque alias voluptatibus molestiae soluta possimus consequatur dolores repudiandae, aut rem! Quidem dolores libero ipsum, rem eos eveniet ea praesentium voluptatem magnam esse itaque.
                </p>
            </div>

            <div className="actions">
                <button
                    type="button"
                    className="icon edit-btn"
                    title="Edit"
                    onClick={e => hadleEditProduct(e, product)}
                >
                    <span className="sr-only">Edit product {product.name}</span>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <button
                    type="button"
                    className="icon delete-btn"
                    title="Delete"
                    onClick={(e) => handleDeleteProductWithStop(e, product._id)}
                >
                    <span className="sr-only">Delete product {product.name}</span>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>

            <footer className="metadata">
                <p>{formatDate(new Date(product.createdAt))}</p>
            </footer>
        </article>
    );
}

function Modal({ isModalOpen, setModalMode, onClose, title, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialogNode = dialogRef.current;
        if (!dialogNode) return;

        if (isModalOpen) {
            dialogNode.showModal();
            setModalMode(true);
        } else {
            dialogNode.close();
            setModalMode(false);
        }

        return () => {
            setModalMode(false);
        };
    }, [isModalOpen]);

    return (
        <dialog
            className="modal"
            ref={dialogRef}
            onClose={onClose}
            onClick={onClose}
        >
            <header>
                <button type="button" className="icon" onClick={onClose}>
                    <span className="sr-only">Close Modal</span>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <h2 id="modal-title">{title}</h2>
            </header>

            <div className="modal-body" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </dialog>
    );
}

function TestCardAsLink() {
    return (
        <div data-src-id="1" data-src-fp="false" data-crb-el="uBWDxb" data-crb-gbl="false" decode-data-ved="1" className="cRH23c" data-ved="0CAAQqIcPahcKEwjA5urdtqyWAxUAAAAAHQAAAAAQLg" data-hveid="0">
            <a className="vIWmYe" data-link-behavior="cobrowse" target="_blank" aria-label="Most JavaScript developers use async/await every day without actually understanding what runs it. The Event Loop is that thing. I spent two years writing JavaScript before I truly understood how the Event Loop worked. Once I did, bugs that used to take me hours to debug started making complete sense in minutes. Here is what you actually need to know: 1. JavaScript is single-threaded but not blocking The Event Loop is what makes async behavior possible without multiple threads. 2. The Call Stack runs your synchronous code first, always Anything async waits in the queue until the stack is completely empty. 3. Microtasks run before Macrotasks Promise callbacks (.then) execute before setTimeout, even if the timer is zero. This catches a lot of developers off guard. 4. Understanding this helps you write better async code You stop writing setTimeout hacks and start understanding why certain code runs out of order. 5. It explains why heavy computations block the UI A long synchronous task freezes the browser because nothing else can run until the stack clears. The mindset shift: JavaScript is not magic. It follows a very specific execution order and once you see it clearly, you write code. Opens in a new tab." rel="noopener" data-ved="0CAEQqYcPahcKEwjA5urdtqyWAxUAAAAAHQAAAAAQLg" href="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https%3A%2F%2Fwww.instagram.com%2Fp%2FDWE-tI6DLip%2F&amp;ved=0CAEQqYcPahcKEwjA5urdtqyWAxUAAAAAHQAAAAAQLg&amp;opi=89978449"></a>
            <div className="Wgphwb">
                <div className="xWZV4e">
                    <div className="NTHYXc" aria-hidden="true">
                        <div aria-hidden="true" className="U9BD8 eRvckb Wsaimf QyEYne">
                            {/* <img src="https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.instagram.com&amp;client=AIM&amp;size=128&amp;type=FAVICON&amp;fallback_opts=TYPE,SIZE,URL" className="sGgDgb" alt=""> */}
                        </div>
                    </div>
                    <div className="jdxGff">
                        <span className="k0vrc">
                            <span className="EsfOKc">
                                <span>Instagram</span>
                            </span>
                        </span>
                    </div>
                    <div className="ac3w5">
                        <div className="xXnAhe">
                            <div data-ved="0CAMQ980PahcKEwjA5urdtqyWAxUAAAAAHQAAAAAQLg">
                                <button className="FTsWP RmjGdc IsqrXb" id="snui-atr-242" aria-label="About this result" aria-describedby="241">
                                    <span className="XjoK4b kkxvEb"></span>
                                    <span jsaction="QBlI0e:.CLIENT;BTifte:.CLIENT;nqgE9d:.CLIENT;fHTtBd:.CLIENT" className="UTNHae"></span>
                                    <span className="I36Cje" aria-hidden="true">
                                        <svg aria-hidden="true" className="H1b7D" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px">
                                            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"></path>
                                        </svg>
                                    </span>
                                    <div className="ypuoue"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pNAzYe">
                    <div className="uzRjgd">
                        <div className="gpZmoc Hnm1Fe" id="241">
                            <span>Most JavaScript developers use async/await every day without actually understanding what runs it. The Event Loop is that thing. I spent two years writing JavaScript before I truly understood how the Event Loop worked. Once I did, bugs that used to take me hours to debug started making complete sense in minutes. Here is what you actually need to know: 1. JavaScript is single-threaded but not blocking The Event Loop is what makes async behavior possible without multiple threads. 2. The Call Stack runs your synchronous code first, always Anything async waits in the queue until the stack is completely empty. 3. Microtasks run before Macrotasks Promise callbacks (.then) execute before setTimeout, even if the timer is zero. This catches a lot of developers off guard. 4. Understanding this helps you write better async code You stop writing setTimeout hacks and start understanding why certain code runs out of order. 5. It explains why heavy computations block the UI A long synchronous task freezes the browser because nothing else can run until the stack clears. The mindset shift: JavaScript is not magic. It follows a very specific execution order and once you see it clearly, you write code</span>
                        </div>
                        <div className="hxIQcc">
                            <span className="hxIQcc">Mar 19, 2026 —
                                <span data-crb-snippet-text="true">And there are two main ones people mix up: microtasks and macrotasks. So here's the mental model that finally made sense… when the...</span>
                            </span>
                        </div>
                    </div>
                    <div className="qK4NEc" style="--thumbnail-width: 82px;">
                        {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdmbBhIcujIzVdxlK4Aq0Um1-eEaKHvEHe4i_YezfLZ-cuScvMeqbtYTDIGVRn34mcB8rgKw" className="WrlSEe" alt=""> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

// function ProductList({ initialProducts }) {
//   const [products, setProducts] = useState(initialProducts);
//   const { addNotification } = useNotify();

//   const handleDelete = async (productId, productName) => {
//     const originalProducts = [...products];

//     setProducts(prev => prev.filter(p => p.id !== productId));

//     try {
//       await fetch(`/api/products/${productId}/delete`, { method: "PATCH" });

//       addNotification(
//         `"${productName}" was deleted.`, 
//         "neutral", 
//         {
//           label: "Undo",
//           onClick: () => handleUndo(productId, originalProducts)
//         }
//       );
//     } catch (err) {
//       setProducts(originalProducts);
//       addNotification("Failed to delete product.", "error");
//     }
//   };

//   const handleUndo = async (productId, originalProducts) => {
//     try {
//       await fetch(`/api/products/${productId}/undo`, { method: "POST" });
      
//       setProducts(originalProducts);
//     } catch (err) {
//       addNotification("Could not undo deletion. The time frame expired.", "error");
//     }
//   };

//   return (
//     <div>
//       {products.map(product => (
//         <div key={product.id} className="product-row">
//           <span>{product.name}</span>
//           <button onClick={() => handleDelete(product.id, product.name)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
    const timeoutController = new AbortController();

    const timeoutId = setTimeout(() => {
        timeoutController.abort();
    }, timeoutMs);

    const signals = [timeoutController.signal];

    if (options.signal) {
        signals.push(options.signal);
    }

    const combinedSignal = AbortSignal.any(signals);

    const response = await fetch(url, {
        ...options,
        signal: combinedSignal
    });
    
    clearTimeout(timeoutId);

    return response;
}

function Links({products}) {
    return (
        <div className="links">
            {products.map(product => (
                <Link key={product._id} to={`products/${product._id}`}>
                    {product.name}
                </Link>
            ))}
        </div>
    )
}

function Header({ title, as: HeadingTag = "h2", children }) {
    if (children) {
        return (
            <header className={`${HeadingTag}-header`}>
                <HeadingTag>{title}</HeadingTag>
                {children}
            </header>
        );
    }

    return <HeadingTag>{title}</HeadingTag>;
}

export default HomePage;