(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

//   on window dom content loaded
$(document).ready(function () {
    
    $("#form").submit(function (e) {
        console.log("test")
        e.preventDefault();
        var formData = {
            'catcha-res': $('input[name=catcha-res]').val(),
            'action': 'verify_gcaptcha',
            'name': $('input[name=name]').val(),
            'discord': $('input[name=discord]').val(),
            'message': $('textarea[name=message]').val(),
        };


        $.ajax({
            type: 'POST',
            url: '/contact',
            data: formData,
            dataType: 'json',
            encode: true,
            success: function (data) {
                showmodal("success", "Sent!", "Your message has been sent successfully, we will get back to you as soon as possible!");
            },
            error: function (data) {
                showmodal("error", "Oh no..", "Something went wrong, please try again later.");
                console.log(data);
            }
        })

    });

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();


    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

})

grecaptcha.ready(function () {
    grecaptcha
      .execute("6Ldc4zUiAAAAAJI49MHtjfaSC5_wtYaAhD3zcJZ2", {
        action: "verify_gcaptcha",
      })
      .then(function (token) {
        document.getElementById("catcha-res").value = token;
      });
});


function showmodal(type, title, body) {
    var modal = document.getElementById("basicModal");
    var modaltitle = document.getElementById("modal-title");
    var modalbody = document.getElementById("modal-body");
    var modalbutton = document.getElementById("modal-button");

    modaltitle.innerHTML = title;
    modalbody.innerHTML = body;

    if (type == "success") {
        modalbutton.classList.remove("btn-danger");
        modalbutton.classList.add("btn-success");
    } else if (type == "error") {
        modalbutton.classList.remove("btn-success");
        modalbutton.classList.add("btn-danger");
    }

    modal.style.display = "block";
    
    $('#basicModal').modal('show');
}
