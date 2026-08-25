# JRock

**JRock** is a lightweight JavaScript UI framework for building reusable web components with a simple HTML-driven API.

The idea behind JRock is straightforward: define the behavior of an element through HTML attributes, let JRock initialize and manage the component, and interact with it through a common JavaScript API.

JRock is currently under active development. The project was built with the goal of creating a collection of reusable UI components and common JavaScript utilities without requiring a large amount of application-specific code.

---

## What JRock Provides

JRock currently provides functionality in several areas:

* Reusable UI components
* A common element abstraction through `JRockElement`
* Centralized component management through `$$$.model`
* Automatic component initialization
* Document-loaded callbacks
* AJAX communication
* Dynamic data handling
* Attribute-based component configuration
* Component-specific validation
* Automatic injection of JRock's CSS
* Multiple instances of the same component on a page

Current components and functionality include:

* **Accordion**
* **Modal**
* **Grid**
* **Combo Box utilities**
* **AJAX**
* **DOM and element utilities**

More components and functionality will be added as development continues.

---

# Why JRock?

JRock is built around the idea that common UI behavior should be configurable directly from HTML while the framework handles the underlying DOM manipulation and state management.

For example, instead of manually creating the internal structure of a component with JavaScript, an application can describe the component in HTML:

```html
<div
    id="employeeGrid"
    grid="true"
    size="800x400"
    headings='["ID","Name","Designation"]'
    columnsWidth='[150,250,250]'>
</div>
```

JRock detects the element, creates the required internal structure, validates its configuration, and manages the component.

Application code can then interact with it through the same framework API:

```javascript
$$$("employeeGrid")
```

---

# Project Structure

A simple repository structure can be:

```text
JRock/
│
├── jrock.js
│
├── examples/
│   ├── accordion.html
│   ├── modal.html
│   ├── grid.html
│   └── ajax.html
│
└── README.md
```

`jrock.js` is the distributable framework.

The files inside `examples/` demonstrate how the framework can be used and are not required for JRock itself to operate.

---

# Getting Started

Include JRock in your HTML:

```html
<script src="jrock.js"></script>
```

That's all that is required to load the framework.

JRock's CSS is bundled into the JavaScript library and injected automatically, so a separate JRock stylesheet is not required.

---

# The `$$$` Function

The main entry point for interacting with JRock elements is:

```javascript
$$$("elementId")
```

For example:

```html
<div id="myElement"></div>
```

```javascript
var element=$$$("myElement");
```

The function retrieves the element by its ID and returns a `JRockElement`.

If the supplied ID does not exist, JRock throws an exception.

---

# JRockElement

`JRockElement` provides the common interface through which application code interacts with JRock-managed elements.

The same `$​$$()` entry point can therefore be used to access different components.

For example:

```javascript
var grid=$$$("employeeGrid");
```

or:

```javascript
var accordion=$$$("myAccordion");
```

Component-specific functionality is exposed through the returned object where appropriate.

This provides a consistent interface instead of requiring the application to directly manipulate each component's internal DOM structure.

---

# Framework Initialization

JRock automatically initializes its components when the document has finished loading.

For application code that needs to work with initialized JRock components, use:

```javascript
$$$.onDocumentLoaded(function()
{
    // Application code
});
```

For example:

```javascript
$$$.onDocumentLoaded(function()
{
    var grid=$$$("employeeGrid");

    // Work with the initialized Grid
});
```

This ensures that JRock's components have been discovered and initialized before application code attempts to use them.

---

# Component Model

JRock maintains its component instances through:

```javascript
$$$.model
```

The model contains collections for different component types.

For example:

```javascript
$$$.model.accordions
$$$.model.modals
$$$.model.grids
```

This allows multiple instances of the same component to exist independently.

For example:

```text
$$$.model
│
├── accordions[]
├── modals[]
└── grids[]
```

Each component instance maintains its own configuration and state.

The model is also part of the framework's internal architecture and provides a central location for managing initialized components.

---

# Components

## Accordion

JRock provides an Accordion component for creating expandable/collapsible sections.

Multiple Accordions can exist on the same page, with their instances maintained independently by JRock.

---

## Modal

JRock provides a Modal component for displaying modal interfaces.

The framework handles the creation and management of the modal's required DOM structure rather than requiring the application to manually construct it.

Multiple Modal instances can be managed independently.

---

## Grid

JRock also provides a configurable Grid component for displaying arrays of objects.

A Grid is created by adding:

```html
grid="true"
```

to a `<div>`.

For example:

```html
<div
    id="employeeGrid"
    grid="true"
    size="800x400"
    headings='["ID","Name","Designation"]'
    columnsWidth='[150,250,250]'>
</div>
```

The Grid supports:

* Dynamic data
* Configurable column headings
* Configurable column widths
* Horizontal scrolling
* Vertical scrolling
* Header/body scroll synchronization
* Optional pagination
* Configurable page size
* Configurable pagination controls
* Borders and colors
* Data supplied asynchronously

Data is supplied through:

```javascript
$$$("employeeGrid").setGridData(data);
```

The Grid is designed to accept data from any application source, including server-side requests.

---

# AJAX

JRock includes an AJAX utility for communicating with server-side applications.

A typical request can be made using:

```javascript
$$$.ajax({
    methodType:"GET",
    url:"employees",

    success:function(responseData)
    {
        // Process the response
    }
});
```

The application controls what happens with the returned data.

For example, server data can be passed directly to a Grid:

```javascript
$$$.onDocumentLoaded(function()
{
    $$$.ajax({
        methodType:"GET",
        url:"employees",

        success:function(responseData)
        {
            var employees=JSON.parse(responseData);

            $$$("employeeGrid").setGridData(employees);
        }
    });
});
```

This allows JRock components to work with dynamically retrieved data without coupling the components to a particular backend technology.

---

# Working With Server-Side Applications

JRock is designed to work with applications where data is retrieved dynamically from a server.

The general flow can be:

```text
Browser
   │
   │ AJAX request
   ▼
Server / Servlet / Backend
   │
   │ Response
   ▼
JRock application code
   │
   ▼
JRock component
```

For example, a server can return JSON data, which application code can then pass to a JRock component.

JRock does not require the data to originate from a particular backend technology.

---

# Attribute-Based Configuration

One of JRock's main design principles is configuring components through HTML attributes.

For example:

```html
<div
    id="employeeGrid"
    grid="true"
    size="800x400"
    pagination="true"
    pageSize="10">
</div>
```

The HTML describes the desired component configuration, while JRock handles the corresponding JavaScript and DOM operations.

This approach keeps component configuration close to the element that uses it.

---

# Validation

JRock performs validation while initializing components.

Component-specific attributes are checked before the component is created.

For example, a Grid validates configuration such as:

* Required attributes
* Dimensions
* Headings
* Column widths
* Pagination configuration
* Page size
* Number of pagination controls
* CSS border values
* CSS color values

Invalid configuration results in an exception rather than silently creating an incorrectly configured component.

This validation approach is used to make configuration errors easier to identify during development.

---

# Automatic CSS

JRock's component styles are part of the framework itself.

The framework injects its CSS automatically when JRock initializes.

Therefore, users only need to include:

```html
<script src="jrock.js"></script>
```

There is no separate JRock CSS file that needs to be imported.

Application-specific CSS remains the responsibility of the application.

---

# Multiple Components

JRock is designed to support multiple instances of the same component.

For example, a page can contain:

```text
Accordion 1
Accordion 2
Accordion 3

Modal 1
Modal 2

Grid 1
Grid 2
Grid 3
```

Each instance is maintained independently.

For Grids, for example:

```javascript
$$$.model.grids
```

contains the initialized Grid objects.

Application code can interact with individual components through their element IDs:

```javascript
$$$("gridOne")
$$$("gridTwo")
$$$("gridThree")
```

---

# Example Application

A simple application might look like:

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>JRock Example</title>

    <script src="jrock.js"></script>
</head>

<body>

<div
    id="employeeGrid"
    grid="true"
    size="800x400"
    pagination="true"
    pageSize="10"
    headings='["ID","Name","Designation"]'
    columnsWidth='[150,250,250]'>
</div>

<script>

$$$.onDocumentLoaded(function()
{
    $$$.ajax({
        methodType:"GET",
        url:"employees",

        success:function(responseData)
        {
            var employees=JSON.parse(responseData);

            $$$("employeeGrid").setGridData(employees);
        }
    });
});

</script>

</body>
</html>
```

The important part is that the application code does not need to construct the Grid's internal DOM structure manually.

JRock handles that responsibility.

---

# License

This project is licensed under the MIT License.

See the LICENSE file for details.
