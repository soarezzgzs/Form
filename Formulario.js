document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const progressBar = document.getElementById("progress-bar");
  const form = document.getElementById("cadastroForm");
  const politica = document.getElementById("politica");
  const successMessage = document.getElementById("successMessage");
  const toggleThemeBtn = document.getElementById("toggle-theme");

  let currentStep = 0;

  // Atualiza etapas e barra de progresso
  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    prevBtn.style.display = currentStep > 0 ? "inline-block" : "none";
    nextBtn.style.display = currentStep < steps.length - 1 ? "inline-block" : "none";
    submitBtn.style.display = currentStep === steps.length - 1 ? "inline-block" : "none";

    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Validação simples + mensagens de erro
  function validateStep() {
    let valid = true;
    const inputs = steps[currentStep].querySelectorAll("input[required]");
    inputs.forEach(input => {
      const errorEl = input.nextElementSibling;
      if (!input.value.trim()) {
        valid = false;
        if (!errorEl || !errorEl.classList.contains("error")) {
          const errorMsg = document.createElement("div");
          errorMsg.className = "error";
          errorMsg.textContent = "Campo obrigatório";
          input.insertAdjacentElement("afterend", errorMsg);
        }
      } else {
        if (errorEl && errorEl.classList.contains("error")) {
          errorEl.remove();
        }
      }
    });
    return valid;
  }

  // Botão próximo
  nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;
    currentStep++;
    updateStep();
  });

  // Botão voltar
  prevBtn.addEventListener("click", () => {
    currentStep--;
    updateStep();
  });

  // Habilitar botão enviar
  form.addEventListener("input", () => {
    submitBtn.disabled = !politica.checked || !validateStep();
  });

  // Envio do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.website && form.website.value) return; // Honeypot

    successMessage.classList.add("show");
    setTimeout(() => successMessage.classList.remove("show"), 3000);

    form.reset();
    currentStep = 0;
    updateStep();
    progressBar.style.width = "0%";
    submitBtn.disabled = true;
  });

  // Alternar tema
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const pressed = toggleThemeBtn.getAttribute("aria-pressed") === "true";
    toggleThemeBtn.setAttribute("aria-pressed", !pressed);
  });

  // Adicionar experiência
  const addExperienceBtn = document.getElementById("addExperience");
  const experiencesContainer = document.getElementById("experiences");
  const expTemplate = document.getElementById("expTemplate");

  addExperienceBtn.addEventListener("click", () => {
    const clone = expTemplate.content.cloneNode(true);
    experiencesContainer.appendChild(clone);
  });

  // Delegação para remover/mover experiências
  experiencesContainer.addEventListener("click", (e) => {
    const exp = e.target.closest(".experience");
    if (!exp) return;

    if (e.target.classList.contains("removeExp")) {
      exp.remove();
    } else if (e.target.classList.contains("moveUp")) {
      exp.previousElementSibling?.before(exp);
    } else if (e.target.classList.contains("moveDown")) {
      exp.nextElementSibling?.after(exp);
    }
  });

  // Pré-visualização do PDF
  const curriculoInput = document.getElementById("curriculo");
  const previewBtn = document.getElementById("previewPdf");
  const pdfPreview = document.getElementById("pdfPreview");
  const pdfFrame = document.getElementById("pdfFrame");
  const closePreview = document.getElementById("closePreview");
  const fileInfo = document.getElementById("fileInfo");

  curriculoInput.addEventListener("change", () => {
    const file = curriculoInput.files[0];
    if (file) {
      fileInfo.textContent = `Arquivo selecionado: ${file.name}`;
      previewBtn.style.display = "inline-block";
    } else {
      fileInfo.textContent = "";
      previewBtn.style.display = "none";
    }
  });

  previewBtn.addEventListener("click", () => {
    const file = curriculoInput.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      pdfFrame.src = url;
      pdfPreview.style.display = "block";
    }
  });

  closePreview.addEventListener("click", () => {
    pdfPreview.style.display = "none";
    pdfFrame.src = "";
  });

  // Máscara CPF
  const cpfInput = document.getElementById("cpf");
  cpfInput.addEventListener("input", () => {
    let v = cpfInput.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    cpfInput.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  });

  // Máscara Telefone
  const telInput = document.getElementById("telefone");
  telInput.addEventListener("input", () => {
    let v = telInput.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 10) {
      telInput.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1 $2-$3");
    } else {
      telInput.value = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "$1 $2-$3");
    }
  });

  updateStep();
});