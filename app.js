// Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;

      // Check for items in local storage
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item into local array
        items.push(item);
        // Set local array into local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get current contents of local storage into local array
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item into local array
        items.push(item);
        // Reset local array into local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      // Get current items list from local storage
      let items = JSON.parse(localStorage.getItem('items'));

      // Loop through items and replace existing item with updated item
      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });

      // Reset local array into local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemStorage: function(id){
      // Get current items list from local storage
      let items = JSON.parse(localStorage.getItem('items'));

      // Loop through items and delete item
      items.forEach(function(item, index){
        if(id === item.id){
          console.log(`deleting ${id}`);
          items.splice(index, 1);
        }
      });

      // Reset local array into local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create incremented ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Parse calories to a number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to data structure
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      // Loop through items to get to the selected item
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },
    updateItem: function(name, calories){
      // Calories to integer
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(id){
      let total = 0;

      // Loop through items and compute total calories
      data.items.forEach(function(item){
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      return total;
    },
    logData: function(){
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li', // All of the li's in the list
    clearBtn: '.clear-btn',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';      
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert node list into an array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert node list into an array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }

})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backBtnClick);

    // Back button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', ClearAllItemsClick);
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item to list in the UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store item in local storage
      StorageCtrl.storeItem(newItem);

      // Clear input fields
      UICtrl.clearInput();
    } else {
      console.log('Invalid Entry');
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break listId into an array to get the item number
      const listIdArr = listId.split('-');

      // Get item number id as an integer
      const id = parseInt(listIdArr[1]);

      // Get item of the clicked id
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    
    e.preventDefault();
  }

  // Delete item submit
  const itemDeleteSubmit = function(e){
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete the item from the UI
    UICtrl.deleteListItem(currentItem.id);

    // Get updated total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories on the UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete item from local storage
    StorageCtrl.deleteItemStorage(currentItem.id);

    // Return to new item entry state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e){

    // Get updated item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update item in the UI
    UICtrl.updateListItem(updatedItem);

    // Get updated total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories on the UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);
    
    // Return to new item entry state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Back button clicked
  const backBtnClick = function(e){
    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  // Clear All button clicked
  const ClearAllItemsClick = function(e){
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get updated total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Update total calories on the UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear items from the UI
    UICtrl.removeItems();

    // Clear items from local storage
    StorageCtrl.clearItemsStorage();

    // Hide UL
    UICtrl.hideList();

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      // Set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Setup initial items list
      if(items.length === 0){
        // Hide item list if no items
        UICtrl.hideList();
      } else {
        // Populate UI list with items if we have items
        UICtrl.populateItemList(items);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
      }

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();