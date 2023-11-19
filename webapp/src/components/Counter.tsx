import React, { useState } from "react";
import { Volume, createFsFromVolume } from "memfs";

const MyComponent = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const dirHandle = await window.showDirectoryPicker();
          console.log(dirHandle);
        }}
      >
        button
      </button>
      {/* Render directory contents or perform operations with fs */}
    </div>
  );
};

export default MyComponent;
