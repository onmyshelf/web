<template>
  <!-- TODO -->
  <div v-if="false" class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button
          type="button"
          class="accordion-button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          Import item information
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Item property</th>
                <th scope="col">Options</th>
                <th scope="col">Preview</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">title</th>
                <td>
                  <select class="form-select" aria-label="Destination property">
                    <option value="key">title</option>
                    <option value="key"></option>
                  </select>
                </td>
                <td>
                  <select class="form-select" aria-label="Options">
                    <option value="key"></option>
                  </select>
                </td>
                <td>{{ trimPreview(item.name) }}</td>
              </tr>
              <tr>
                <th scope="row">cover</th>
                <td>
                  <select class="form-select" aria-label="Destination property">
                    <option value="key">image</option>
                    <option value="key"></option>
                  </select>
                </td>
                <td>
                  <select class="form-select" aria-label="Options">
                    <option value="key"></option>
                    <option value="key">download</option>
                  </select>
                </td>
                <td>{{ trimPreview(item.image) }}</td>
              </tr>
              <tr>
                <th scope="row">description</th>
                <td>
                  <select class="form-select" aria-label="Destination property">
                    <option value="key">description</option>
                  </select>
                </td>
                <td>
                  <select class="form-select" aria-label="Options">
                    <option value="key">to string</option>
                  </select>
                </td>
                <td>{{ trimPreview(item.description) }}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <button class="btn btn-primary">Import into item</button>
          </p>
          <div class="form-check">
            <input
              type="checkbox"
              value=""
              class="form-check-input"
              id="flexCheckChecked"
              checked
            />
            <label class="form-check-label" for="flexCheckChecked">
              Remember my choices
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    trimPreview(string) {
      return String(string).substring(0, 50)
    },
  }
}
</script>
