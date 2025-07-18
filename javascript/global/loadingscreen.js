function hideLogInbeforeAnimation() {
  setTimeout(() => {
    document.querySelector('.logoPageHeader')?.classList.remove('hide');
    document.querySelector('.LogInMainContainer')?.classList.remove('hide');
    document.querySelector('footer')?.classList.remove('hide');
  }, 2000); 
}
document.addEventListener('DOMContentLoaded', () => {
  hideLogInbeforeAnimation();
});