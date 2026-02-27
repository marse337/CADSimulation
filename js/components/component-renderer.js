/**
 * Component Renderer - Core rendering engine for reusable UI components
 * Registers components and renders them from data-* attribute configuration
 */
(function() {
  'use strict';

  const components = {};

  /**
   * Register a component with a render function
   * @param {string} name - Component name (matches data-component attribute)
   * @param {Function} renderFn - Function that returns HTML string from config object
   */
  function register(name, renderFn) {
    components[name] = renderFn;
  }

  /**
   * Parse data-* attributes into a config object
   * Converts kebab-case to camelCase and parses JSON values
   * @param {Element} element - DOM element with data-* attributes
   * @returns {Object} Config object
   */
  function parseConfig(element) {
    const config = {};

    for (const attr of element.attributes) {
      if (attr.name.startsWith('data-') && attr.name !== 'data-component') {
        // Convert data-some-attr to someAttr
        const key = attr.name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        let value = attr.value;

        // Try to parse as JSON for objects/arrays
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if JSON parse fails
          }
        }

        config[key] = value;
      }
    }

    return config;
  }

  /**
   * Render a single component
   * @param {Element} element - DOM element with data-component attribute
   */
  function renderComponent(element) {
    const componentName = element.getAttribute('data-component');
    const renderFn = components[componentName];

    if (!renderFn) {
      console.warn(`ComponentRenderer: Unknown component "${componentName}"`);
      return;
    }

    const config = parseConfig(element);
    const html = renderFn(config);

    // Create a temporary container to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Replace the placeholder with the rendered content
    while (temp.firstChild) {
      element.parentNode.insertBefore(temp.firstChild, element);
    }
    element.parentNode.removeChild(element);
  }

  /**
   * Render all components with data-component attribute
   */
  function renderAll() {
    const placeholders = document.querySelectorAll('[data-component]');
    placeholders.forEach(renderComponent);
  }

  // Expose the API
  window.ComponentRenderer = {
    register: register,
    renderAll: renderAll,
    renderComponent: renderComponent
  };
})();
