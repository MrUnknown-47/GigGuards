import logging
import sys

def setup_logger(name: str = "gigshield") -> logging.Logger:
    """
    Configures and returns a centralized logger for the application.
    Logs are cleanly formatted to standard output.
    """
    logger = logging.getLogger(name)
    
    # Prevent attaching multiple handlers if the logger is re-imported
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Consistent log formatting
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | [%(filename)s:%(lineno)d] | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(console_handler)
        
    return logger

# Expose a default global logger instance
logger = setup_logger()
