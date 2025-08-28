// JavaScript Document


$(document).ready(function() {
    $( window ).scroll(function() {
          var height = $(window).scrollTop();
          if(height >= 100) {
              $('.mn-head').addClass('fixed-menu');
          } else {
              $('.mn-head').removeClass('fixed-menu');
          }
      });
  });
  $(document).ready(function() {
    window.addEventListener('load', async () => {
      let video = document.querySelector('video[muted][autoplay]');
      try {
        await video.play();
      } catch (err) {
        video.controls = true;
      }
    });

  });

  $(document).ready(function(){
    $('.testimonial-slide').owlCarousel({
        loop: true,
        margin: 35,
        nav:false,
		dots:true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items:1
            },
            768: {
                items:2
            },
            1000: {
                items:3
            }
        }
    })

    
	
    
	$('.latest-blog').owlCarousel({
        
		autoplay:true,
        margin:40,
        nav: false,
		dots:true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items:1
            },
            768: {
                items:2
            },
            1024: {
              items:3
          }
        }
    })

    $('.client-slide').owlCarousel({
        
		autoplay:true,
        margin:40,
        loop:true,
        nav: false,
		dots:true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items:1
            },
            768: {
                items:2
            },
            1024: {
              items:5
          }
        }
    })

});
