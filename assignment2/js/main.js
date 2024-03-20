/********************************************************************************
 * WEB422 – Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Yoojin Lee   Student ID: 188162218   Date: Jan 31, 2024
 *
 ********************************************************************************/
let page = 1;
const perPage = 10;
let searchName = "";

const listingsUrl = "https://pear-wandering-harp-seal.cyclic.app";

function loadListingsData() {
  let url = `${listingsUrl}/api/listings?page=${page}&perPage=${perPage}`;

  if (searchName) {
    url += `&name=${encodeURIComponent(searchName)}`;
  }

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status);
    })
    .then((data) => {
      // obtain <tbody> element
      const tbody = document.querySelector("#listingsTable tbody");
      tbody.innerHTML = "";

      if (data.length) {
        // non-empty array (listings available)
        let postRows = `${data
          .map(
            (post) =>
              `<tr data-id="${post._id}">
                <td>${post.name}</td>
                <td>${post.room_type}</td>
                <td>${post.address.street}</td>
                <td>${post.summary}<br /><br />
                <strong>Accommodates: </strong>${post.accommodates}<br />
                <strong>Rating: </strong>${post.review_scores.review_scores_rating}(${data.number_of_reviews} Reviews)
                </td>
             </tr>
          `
          )
          .join("")}`;
        // updating tp show newly created <tr> elements
        tbody.innerHTML = postRows;

        //! Click event
        document.querySelectorAll("#listingsTable tbody tr").forEach((row) => {
          row.addEventListener("click", (e) => {
            let rowClicked = row.getAttribute("data-id");

            // make a request for data using the path
            fetch(`${listingsUrl}/api/listings/${rowClicked}`)
              .then((res) => {
                return res.ok ? res.json() : Promise.reject(res.status);
              })
              .then((data) => {
                // Set the "modal-title"
                let modalTitle = document.querySelector("#detailsModal .modal-title");
                modalTitle.textContent = data.name; // textContent('Hi') vs innerHTML(<p>Hi</p>)

                // Set the "modal-body"
                let modalBody = document.querySelector("#detailsModal .modal-body");
                modalBody.innerHTML = `
                <div class="modal-body">
                <img id="photo" onerror="this.onerror=null;this.src = 
                n//placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" 
                src="${data.images.picture_url}"></img><br><br>
                ${data.neighborhood_overview}<br><br>
                <strong>Price:</strong> ${data.price}.00<br>
                <strong>Room:</strong> ${data.room_type}<br>
                <strong>Bed:</strong> ${data.bed_type} (${data.beds})<br><br>
                </div>`;

                // Show Modal
                let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                  backdrop: "static",
                  keyboard: false,
                });

                modal.show();
              });
          });
        });

        // Updating the "current page"
        document.querySelector("#current-page").innerHTML = page;

        // empty array (no listings available)
      } else {
        // Check to see if page is greater than 1 (ie, the user is not on the first page)
        if (page > 1) {
          page--;
        } else {
          const tbody = document.querySelector("#listingsTable tbody");
          let addRow = `<tr><td colspan="4"><strong>No data available</td></tr>`;
          tbody.innerHTML = addRow;
        }
      }
    })
    .catch((err) => {
      // error (no listings available)
      console.log(err.message);
    });
}

// Executed when the "DOM is ready"
document.addEventListener("DOMContentLoaded", function () {
  loadListingsData();
  // previous page
  document.querySelector("#previous-page").addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadListingsData();
    }
  });

  //! next page pagination
  document.querySelector("#next-page").addEventListener("click", () => {
    // count the number of rows (listings) currently displayed in the table
    const currentListings = document.querySelectorAll("#listingsTable tbody tr").length; // 10
    // if current displayed listings is equal to default perPage, proceed to the next page
    if (currentListings === perPage) {
      page++;
      loadListingsData();
    }
  });

  // submit event for searchForm form
  document.querySelector("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    // set the global searchName value to the value the user entered int the "name" field of the "serachForm"
    searchName = document.querySelector("#name").value;
    page = 1;
    loadListingsData();
  });

  // click event for clearForm button
  document.querySelector("#clearForm").addEventListener("click", () => {
    document.querySelector("#name").value = "";
    searchName = null;
    loadListingsData();
  });
});
