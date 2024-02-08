import React, { useState, useEffect } from 'react';
import './App.css';

const EmailInput = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [showEmailSentMessage, setShowEmailSentMessage] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState(60);
  const [otpStatus, setOtpStatus] = useState(null);

  const handleChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsValid(emailPattern.test(inputEmail));
  };

  const handleGetOtp = () => {
    if (email && isValid) {
      const newGeneratedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newGeneratedOtp);
      setIsOtpGenerated(true);
      setShowEmailSentMessage(true); // Show email sent message
      setTimeout(() => setShowEmailSentMessage(false), 5000); // Hide after 5 seconds
      setCountdown(60);
      setOtp(Array(6).fill(''));
      setOtpStatus(null);
    }
  };

  const handleOtpChange = (elementIndex) => (e) => {
    const newOtp = [...otp];
    newOtp[elementIndex] = e.target.value.slice(0, 1);
    setOtp(newOtp);
  
    if (e.target.value) {
      if (elementIndex < otp.length - 1) {
        document.getElementById(`otp-${elementIndex + 1}`).focus();
      }
    } else if (elementIndex > 0) {
      document.getElementById(`otp-${elementIndex - 1}`).focus();
    }
  
    if (newOtp.join('').length === 6) {
      if (newOtp.join('') === generatedOtp) {
        setOtpStatus('success');
      } else {
        setOtpStatus('error');
      }
    } else {
      setOtpStatus(null);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isOtpGenerated && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsOtpGenerated(false);
      setOtpStatus(null);
      setOtp(Array(6).fill(''));
    }

    return () => clearInterval(interval);
  }, [isOtpGenerated, countdown]);

  const validateOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === generatedOtp) {
      setOtpStatus('success');
      // Show success message
      const successAlert = document.getElementById('success-alert');
      successAlert.style.display = 'flex';
      setTimeout(() => { successAlert.style.display = 'none'; }, 3000);
    } else {
      setOtpStatus('error');
      alert('OTP validation failed');
    }
  };

  return (
    <div className="App">
      <div id="success-alert" className="alert">
        OTP validation successful
      </div>
      {showEmailSentMessage && (
        <div className="email-sent-message">
          <img
            src='https://www.providencecatholic.org/wp-content/uploads/email-icon.png'
            alt='Email icon'
            style={{ height: '50px' }}
          />
          <p>Generated OTP is: {generatedOtp}</p>
        </div>
      )}
      <div className="center">
        <h1>Email Validation</h1>
        <input
          type="text"
          placeholder="Enter your email address"
          value={email}
          onChange={handleChange}
          style={{ borderColor: isValid ? 'green' : 'red' }}
        />
        {!isValid && email !== '' && (
          <p className="error-message">Please enter a valid email address.</p>
        )}
        <p className="clickable-text" onClick={handleGetOtp} role="button" tabIndex={0}>
          {isOtpGenerated ? 'Resend OTP' : 'Get OTP'}
        </p>
        {isOtpGenerated && (
          <div>
            <div className="otp-container">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className={`otp-input ${otpStatus}`}
                  value={value}
                  onChange={handleOtpChange(index)}
                  onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[index] && index > 0) { document.getElementById(`otp-${index - 1}`).focus(); } }}
                  maxLength="1"
                  autoFocus={index === 0}
                  autoComplete="off"
                  disabled={countdown === 0}
                />
              ))}
          </div>
            {countdown > 0 ? (
              <p>Submit OTP within {countdown} seconds.</p>
            ) : (
              <p>OTP expired. <span onClick={handleGetOtp} className="clickable-text" role="button" tabIndex={0}>Retry</span></p>
            )}
            <p className="clickable-text" onClick={validateOtp} role="button" tabIndex={0}>
              Validate OTP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailInput;
