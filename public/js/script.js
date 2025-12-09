(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();
  


document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", async () => {

    const id = btn.dataset.id;

    const res = await fetch(`/community/blogPost/${id}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
     if (res.status === 401) {
      alert(data.message || "Please login first");
      return;
    }
    // Update like count instantly
    btn.querySelector(".like-count").textContent = data.likes;

    // Toggle button color
    if (data.liked) {
      btn.classList.add("text-danger");
    } else {
      btn.classList.remove("text-danger");
    }
  });
});


document.querySelectorAll(".likeb-btn").forEach(btn => {
  btn.addEventListener("click", async () => {

    const id = btn.dataset.id;

    const res = await fetch(`/community/Blog/${id}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
     if (res.status === 401) {
      alert(data.message || "Please login first");
      return;
    }
    // Update like count instantly
    btn.querySelector(".likeb-count").textContent = data.likes;

    // Toggle button color
    if (data.liked) {
      btn.classList.add("text-danger");
    } else {
      btn.classList.remove("text-danger");
    }
  });
});
