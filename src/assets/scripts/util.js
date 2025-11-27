import $ from 'jquery';

$(document).ready(function() {
  console.log('jQuery is ready!');

  // Hover demo: toggle an "active" class on the sample box if it exists
  const $hoverBox = $('#hover-demo .contact-item');
  if ($hoverBox.length) {
    $hoverBox.on('mouseenter', function() {
      $(this).addClass('is-active');
    });
    $hoverBox.on('mouseleave', function() {
      $(this).removeClass('is-active');
    });
  }
});
