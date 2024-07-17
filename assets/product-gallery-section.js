document.addEventListener("DOMContentLoaded", () => {
  const product = window.ShopifyProductData;
  const productImage = document.getElementById("product-image");
  const productIdInput = document.getElementById("product-id");
  const thumbnailContainer = document.querySelector(".thumbnail-container");
  const thumbnailList = document.querySelector(".thumbnail-images");
  const thumbnailItems = document.querySelectorAll(".thumbnail-images li");
  const productOptions = document.querySelectorAll(
    ".product-option input[type='radio']"
  );

  function updateProductDetails(matchedVariant) {
    productIdInput.value = matchedVariant.id;

    document
      .querySelectorAll(".product-options-title span")
      .forEach((span, index) => {
        span.textContent = matchedVariant.options[index];
      });

    if (matchedVariant.featured_image) {
      productImage.setAttribute("src", matchedVariant.featured_image.src);
      document
        .querySelector(".thumbnail-item-active")
        .classList.remove("thumbnail-item-active");
      thumbnailItems[matchedVariant.featured_image.position - 1].classList.add(
        "thumbnail-item-active"
      );

      thumbnailItems.forEach((item) => {
        item.classList.toggle(
          "hide",
          item.dataset.alt !== matchedVariant.featured_image.alt
        );
      });

      // Check if active item is visible
      const activeItem = document.querySelector(".thumbnail-item-active");
      if (activeItem) {
        const activeRect = activeItem.getBoundingClientRect();
        const containerRect = thumbnailList.getBoundingClientRect();

        // Scroll to active item if it's not visible
        if (
          activeRect.bottom > containerRect.bottom ||
          activeRect.top < containerRect.top
        ) {
          thumbnailList.scroll({
            top: thumbnailList.scrollTop + activeRect.top - containerRect.top,
            behavior: "smooth",
          });
        }
      }
    }
  }

  function showNextImage() {
    const activeIndex = Array.from(thumbnailItems).findIndex((item) =>
      item.classList.contains("thumbnail-item-active")
    );
    if (activeIndex !== -1) {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= thumbnailItems.length) {
        nextIndex = 0;
      }
      while (thumbnailItems[nextIndex].classList.contains("hide")) {
        nextIndex++;
        if (nextIndex >= thumbnailItems.length) {
          nextIndex = 0;
        }
      }
      thumbnailItems[activeIndex].classList.remove("thumbnail-item-active");
      thumbnailItems[nextIndex].classList.add("thumbnail-item-active");
      productImage.setAttribute(
        "src",
        thumbnailItems[nextIndex].querySelector("img").src
      );

      // Scroll to new active item
      const activeRect = thumbnailItems[nextIndex].getBoundingClientRect();
      const containerRect = thumbnailList.getBoundingClientRect();
      if (
        activeRect.bottom > containerRect.bottom ||
        activeRect.top < containerRect.top
      ) {
        thumbnailList.scroll({
          top: thumbnailList.scrollTop + activeRect.top - containerRect.top,
          behavior: "smooth",
        });
      }
    }
  }

  function showPreviousImage() {
    const activeIndex = Array.from(thumbnailItems).findIndex((item) =>
      item.classList.contains("thumbnail-item-active")
    );
    if (activeIndex !== -1) {
      let prevIndex = activeIndex - 1;
      if (prevIndex < 0) {
        prevIndex = thumbnailItems.length - 1;
      }
      while (thumbnailItems[prevIndex].classList.contains("hide")) {
        prevIndex--;
        if (prevIndex < 0) {
          prevIndex = thumbnailItems.length - 1;
        }
      }
      thumbnailItems[activeIndex].classList.remove("thumbnail-item-active");
      thumbnailItems[prevIndex].classList.add("thumbnail-item-active");
      productImage.setAttribute(
        "src",
        thumbnailItems[prevIndex].querySelector("img").src
      );

      // Scroll to new active item
      const activeRect = thumbnailItems[prevIndex].getBoundingClientRect();
      const containerRect = thumbnailList.getBoundingClientRect();
      if (
        activeRect.bottom > containerRect.bottom ||
        activeRect.top < containerRect.top
      ) {
        thumbnailList.scroll({
          top: thumbnailList.scrollTop + activeRect.top - containerRect.top,
          behavior: "smooth",
        });
      }
    }
  }

  updateProductDetails(product.variants[0]);

  productOptions.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selectedOptions = Array.from(productOptions).map((radio) => ({
        value: radio.value,
        checked: radio.checked,
        label: radio.nextElementSibling, // Get the next sibling element (label)
        dataAttr: radio.dataset.swatchColor, // Get the data attribute value
      }));

      const matchedVariant = product.variants.find((variant) =>
        variant.options.every((option, index) =>
          selectedOptions.find(
            (radio) => radio.value === option && radio.checked
          )
        )
      );

      if (matchedVariant) {
        updateProductDetails(matchedVariant);

        // Apply or remove data-swatch-color attribute styles to label
        selectedOptions.forEach(({ label, dataAttr, checked }) => {
          if (checked) {
            console.log(label, dataAttr);
            label.style.setProperty("background-color", dataAttr); // Apply style based on data-swatch-color
          } else {
            label.style.removeProperty("background-color"); // Remove style if not checked
          }
        });
      }
    });
  });

  document
    .querySelector(".arrow-up")
    .addEventListener("click", showPreviousImage);
  document
    .querySelector(".arrow-down")
    .addEventListener("click", showNextImage);

  thumbnailItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("hide")) {
        document
          .querySelector(".thumbnail-item-active")
          .classList.remove("thumbnail-item-active");
        item.classList.add("thumbnail-item-active");
        productImage.setAttribute("src", item.querySelector("img").src);
      }
    });
  });
});
