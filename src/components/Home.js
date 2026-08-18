

// function Home(Props){

//     const{students, info, name} = Props;
//     return (
//         <div>
//             <h1>The World is Yours, Lion</h1>
//             <h2>{name}</h2>
//             <h3>Greatest of all time {students.map}</h3>
//             <div>
//                  <h4>{info.first}</h4>
//                  <h4>{info.last}</h4>
//                  <h4>{info.age}</h4>
//             </div>
//         </div>
//     )

// }

// function Home({ users }) {
//     return (
//       <div>
//         {users.map((user) => (
//           <div key={user.id}>
//             <h3>{user.name}</h3>
//             <p>ID: {user.id}</p>
//             <p>Email: {user.email}</p>
//             <p>Age: {user.age}</p>
//             <p>Sex: {user.sex}</p>
//             <p>Occupation: {user.occupation}</p>
//             <p>Country: {user.country}</p>
//             <hr />
//           </div>
//         ))}
//       </div>
//     );
//   }


// function Home({ products }) {
//     return (
//       <div>
//         <h1>Products</h1>
  
//         {products.map((product) => (
//           <div key={product.id}>
//             <h3>{product.name}</h3>
//             <p>ID: {product.id}</p>
//             <p>Price: ${product.price}</p>
//             <p>Category: {product.category}</p>
//             <p>Brand: {product.brand}</p>
//             <p>Stock: {product.stock}</p>
//             <p>Rating: {product.rating}</p>
//             <hr />
//           </div>
//         ))}
//       </div>
//     );
//   }
  
  // export default Home;

  function Home({ students }) {
    return (
      <div>
        <h2>Student List</h2>
  
        {students.map((student, index) => (
          <p key={index}>
            {index + 1}. {student}
          </p>
        ))}
      </div>
    );
  }
  
  export default Home;